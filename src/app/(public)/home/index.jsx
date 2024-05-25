'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import * as faceapi from 'face-api.js'
import { useGetList, usePost } from '~/services/dashboard'
import Loading from '~/components/loading'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { calculateEAR } from '~/helpers/utils'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
const Clock = dynamic(() => import('../../../components/Clock'))

function Root() {
  const [ekspresi, setEkspresi] = useState()
  const [camOn, setCamOn] = useState(false)
  const [reportOn, setReportOn] = useState(false)
  const [foto, setFoto] = useState()
  const [user, setUser] = useState()
  const [entryTime, setEntryTime] = useState()
  const [isPunctual, setIsPunctual] = useState()
  const [enterExit, setEnterExit] = useState()
  const [faceMatcher, setFaceMatcher] = useState(null)
  const capturedPhotoRef = useRef()
  const webcamRef = useRef()
  const canvasRef = useRef()
  const { data: macAddress } = useGetList('address')
  const { data: users } = useGetList('users')
  const { mutateAsync: postReport, error: errorPostReport } = usePost('reports')
  const { mutateAsync: uploadFile, error: errorUploadFile } = usePost('upload')

  dayjs.extend(relativeTime)
  useEffect(() => {
    const setupFaceRecognition = async () => {
      try {
        // Load labeled face descriptors and create a FaceMatcher
        const labeledFaceDescriptors = await loadLabeledFaceDescriptors()
        setFaceMatcher(new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6))
      } catch (error) {
        console.error('Error setting up face recognition:', error)
      }
    }

    const loadModels = () => {
      return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(setupFaceRecognition)
    }

    const loadLabeledFaceDescriptors = async () => {
      const labeledFaceDescriptors = []

      for (const item of users) {
        const descriptors = []
        for (const descriptor of item.descriptors) {
          const float32ArrayDescriptor = new Float32Array(
            Object.values(descriptor),
          )
          descriptors.push(float32ArrayDescriptor)
        }
        const label = `${item.name} / ${item.nip}`
        labeledFaceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(label, descriptors),
        )
      }
      console.log('labeled', labeledFaceDescriptors)
      return labeledFaceDescriptors
    }
    loadModels()
  }, [users])

  const handleOn = async () => {
    setCamOn(true)
    startVideo()
    reportOn && setReportOn(false)
  }

  const handleOff = async () => {
    setCamOn(false)
    stopVideo()
    reportOn && setReportOn(false)
  }

  const stopVideo = () => {
    stopDetectMyFace()
    const stream = webcamRef.current.srcObject
    const tracks = stream.getTracks()

    tracks.forEach((track) => {
      track.stop()
    })

    webcamRef.current.srcObject = null
  }

  const startVideo = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: true }, { facingMode: 'user' })
      .then((currentStream) => {
        webcamRef.current.srcObject = currentStream
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        detectMyFace()
      })
  }

  const [intervalId, setIntervalId] = useState(null)

  const stopDetectMyFace = () => {
    clearInterval(intervalId)
  }

  const detectMyFace = () => {
    const webcam = webcamRef.current
    const canvas = canvasRef.current
    // const displaySize = {
    //   width: webcam.offsetWidth,
    //   height: webcam.offsetHeight,
    // }
    // faceapi.matchDimensions(canvas, displaySize)

    setIntervalId(null)
    const id = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor()

      if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: webcam.offsetWidth,
          height: webcam.offsetHeight,
        })
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        // Face recognition
        if (faceMatcher && !!detections?.descriptor?.length) {
          const bestMatch = faceMatcher.findBestMatch(detections.descriptor)

          const nama = bestMatch.label.split(' / ')[0]
          const nip = bestMatch.label.split(' / ')[1]
          const confidence = 1 - bestMatch.distance

          const text = `${nama} (${Math.round(confidence * 100)}%)`
          const anchor = {
            x: resizedDetections.detection.box.x,
            y: resizedDetections.detection.box.y,
          }
          const drawOptions = {
            anchorPosition: 'BOTTOM_LEFT',
            backgroundColor: 'rgba(0, 0, 219)',
          }
          const drawBox = new faceapi.draw.DrawTextField(
            text,
            anchor,
            drawOptions,
          )
          drawBox.draw(canvas)
          detectBlink(detections, nip)
        }
      }
    }, 100)

    setIntervalId(id)
  }

  const detectBlink = async (detections, nip) => {
    try {
      const leftEye = detections.landmarks.getLeftEye()
      const rightEye = detections.landmarks.getRightEye()

      const leftEAR = calculateEAR(leftEye)
      const rightEAR = calculateEAR(rightEye)

      const avgEAR = (leftEAR + rightEAR) / 2

      const threshold = 0.285
      if (avgEAR < threshold) {
        console.log('Blink Detected!')

        const userData = await users.find((u) => u.nip === nip)
        console.log('userData', userData)
        await setUser(() => userData)

        let obj = detections.expressions
        const expression = Object.keys(obj).reduce((a, b) =>
          obj[a] > obj[b] ? a : b,
        )
        const now = new Date()
        const time = now.getHours() + ':' + now.getMinutes()

        await setEkspresi(expression)

        setEntryTime(time)
        if (userData.id) {
          await takePhoto(now, userData, expression)
          setCamOn(false)
          stopVideo()
          // await uploadReport(now, userData, expression)
        }
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      }
    }
  }

  const takePhoto = (now, userData, expression) => {
    const video = webcamRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        console.log(blob)
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          const myFile = new File([blob], 'photo', { type: 'image/png' })
          uploadReport(now, userData, expression, myFile)
          // Set the Blob URL as the src for local preview
          capturedPhotoRef.current = {}
          capturedPhotoRef.current.src = imageUrl
          setFoto(imageUrl)
        }
      })

      showReport()
    }
  }

  const uploadReport = async (now, userData, expression, myFile) => {
    const payload = {
      timestamp: now,
      ekspresi: expression,
      userId: userData?.id,
    }
    const formData = new FormData()
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key])
    })
    const res = await postReport(payload)
    if (res?.id) {
      const formData = new FormData()
      formData.append('file', myFile)
      formData.append('reportId', res.id)
      await uploadFile(formData)
    }
    console.log('report', report)
  }

  const showReport = async () => {
    await setReportOn(true)
    setTimeout(() => {
      setReportOn(false)
    }, 5000)
  }

  return (
    <div className="flex flex-col gap-4 justify-between items-center p-8 h-screen relative">
      <div className="flex grow justify-center">
        {camOn && (
          <div name="webcam-div" className="flex items-center relative">
            <video crossOrigin="anonymous" ref={webcamRef} autoPlay></video>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute inset-y-auto z-10 border-5 border-purple-600"
            />
          </div>
        )}
        {!camOn && !!reportOn && (
          <div name="report-div" className="flex items-center">
            <img src={foto} alt="ini foto" />
            <div className="px-8 text-xl space-y-1.5 font-normal">
              <p>Nama: {user?.name}</p>
              <p>NIP: {user?.nip}</p>
              <p>
                Jabatan:
                {user?.position?.charAt(0) +
                  user?.position?.slice(1).toLowerCase()}
              </p>
              <p>
                Unit: {user?.unit}{' '}
                {user?.subunit && <span>- {user?.subunit}</span>}
              </p>
              <p>Waktu Presensi: {entryTime}</p>
              <p>Ketepatan Waktu: {isPunctual}</p>
              <p>Ekspresi: {ekspresi}</p>
            </div>
          </div>
        )}
      </div>
      {faceMatcher === null ? (
        <Loading />
      ) : (
        <button
          type="button"
          className={`${camOn ? 'bg-gray-500' : 'bg-blue-500'} ${
            camOn ? 'hover:bg-blue-700' : 'hover:bg-gray-700'
          } text-white font-bold py-2 px-4 rounded mb-4`}
          onClick={camOn ? handleOff : handleOn}
        >
          {`${camOn ? 'Matikan' : 'Nyalakan'}`} Kamera
        </button>
      )}
      <div name="clock-and-info" className="grid justify-items-center gap-2">
        <Clock />
        <div className="text-xl2 text-center">
          Your MAC Address:{' '}
          <b>{!!macAddress?.wlp1s0?.length && macAddress?.wlp1s0[0]?.mac}</b>
        </div>
      </div>
    </div>
  )
}
export default Root
