'use client'
import { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import Clock from '../../../components/Clock'
import Link from 'next/link'
import { useGetList } from '~/services/dashboard'

function Root() {
  const [hasilPresensi, setHasilPresensi] = useState()
  const [camOn, setCamOn] = useState(false)
  const [reportOn, setReportOn] = useState(false)
  const [foto, setFoto] = useState()
  const [faceMatcher, setFaceMatcher] = useState(null)
  const capturedPhotoRef = useRef()
  const webcamRef = useRef()
  const canvasRef = useRef()
  const { data: macAddress } = useGetList('address')
  const { data: Descriptors } = useGetList('descriptors')

  useEffect(() => {
    const setupFaceRecognition = async () => {
      try {
        // Load models first
        await loadModels()

        // Load labeled face descriptors and create a FaceMatcher
        const labeledFaceDescriptors = await loadLabeledFaceDescriptors()

        setFaceMatcher(new faceapi.FaceMatcher(labeledFaceDescriptors, 0.3))
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
      ])
    }

    const loadLabeledFaceDescriptors = async () => {
      const labeledFaceDescriptors = []

      for (const item of Descriptors) {
        const descriptors = []

        for (const descriptor of item.descriptors) {
          const float32ArrayDescriptor = new Float32Array(descriptor)
          descriptors.push(float32ArrayDescriptor)
        }

        labeledFaceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(item.label, descriptors),
        )
      }
      console.log('labeled', labeledFaceDescriptors)
      return labeledFaceDescriptors
    }
    setupFaceRecognition()
  }, [Descriptors])

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
    // const displaySize = { width: webcam.videoWidth, height: webcam.videoHeight };
    // console.log("displaySize", webcamRef.current.videoHeight);
    // faceapi.matchDimensions(canvas, displaySize);

    setIntervalId(null)
    const id = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor()

      if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: 640,
          height: 480,
        })
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        // Face recognition
        if (faceMatcher) {
          console.log('JALAN')
          // console.log('descriptor', detections.descriptor)
          // console.log('faceMatcher', faceMatcher)
          const bestMatch = faceMatcher.findBestMatch(detections.descriptor)
          console.log(bestMatch.toString())
          const label = bestMatch.label
          const confidence = 1 - bestMatch.distance // Confidence level
          // console.log('bestMatch: ', bestMatch)
          // console.log('confidence: ', confidence)
          // Draw face recognition result on the canvas
          const text = `${label} (${Math.round(confidence * 100)}%)`
          console.log(text)
          new faceapi.draw.DrawTextField([text], {
            drawLabelOptions: {
              anchorPosition: 'TL',
            },
          }).draw(canvas)
        }

        // detectBlink(detections)
      }
    }, 100)

    setIntervalId(id)
  }

  const detectBlink = async (detections) => {
    const leftEye = detections.landmarks.getLeftEye()
    const rightEye = detections.landmarks.getRightEye()

    const leftEAR = calculateEAR(leftEye)
    const rightEAR = calculateEAR(rightEye)

    const avgEAR = (leftEAR + rightEAR) / 2

    const threshold = 0.285
    if (avgEAR < threshold) {
      console.log('Blink Detected!')
      let obj = detections.expressions
      setHasilPresensi(
        Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b)),
      )
      // console.log('ekspresi =', JSON.stringify(obj))
      // console.log(
      //   'ekspresi urut =',
      //   JSON.stringify(
      //     Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a)),
      //   ),
      // )
      // console.log(
      //   'ekspresi dominan',
      //   Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b)),
      // )
      await takePhoto()
      setCamOn(false)
      stopVideo()
    }
  }

  // const detectBlink = (detections) => {
  //   const leftEye = detections.landmarks.getLeftEye()
  //   const rightEye = detections.landmarks.getRightEye()

  //   const leftEAR = calculateEAR(leftEye)
  //   const rightEAR = calculateEAR(rightEye)

  //   const avgEAR = (leftEAR + rightEAR) / 2

  //   const threshold = 0.285 // Adjust this threshold as needed
  //   const minBlinkDuration = 0.1 // Minimum duration of a blink in seconds
  //   const maxBlinkDuration = 0.6 // Maximum duration of a blink in seconds

  //   // const minEARForBlink = 0.15; // Adjust this threshold as needed
  //   const blinkDuration = 0.3 // Duration of a blink in seconds

  //   let startBlinkTime = null
  //   let lastBlinkTime = null

  //   // if (avgEAR < threshold && (leftEAR < minEARForBlink || rightEAR < minEARForBlink)) {
  //   if (avgEAR < threshold) {
  //     const currentTime = Date.now()

  //     if (
  //       !lastBlinkTime ||
  //       currentTime - lastBlinkTime > minBlinkDuration * 1000
  //     ) {
  //       // Start of a new blink
  //       startBlinkTime = currentTime
  //       console.log('Kurang lama Meremnya')
  //     } else if (currentTime - startBlinkTime > maxBlinkDuration * 1000) {
  //       // Reset if blink duration exceeds the maximum allowed
  //       startBlinkTime = currentTime
  //       console.log('Kelamaan Merem')
  //     }

  //     if (currentTime - startBlinkTime >= blinkDuration * 1000) {
  //       // Blink detected, capture photo or take appropriate action
  //       console.log('Blink Detected!')
  //       let obj = detections.expressions
  //       setHasilPresensi(
  //         Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b)),
  //       )
  //       // lastBlinkTime = currentTime;
  //     }
  //   } else {
  //     startBlinkTime = null
  //   }
  // }

  const calculateEAR = (eyeLandmarks) => {
    // Hitung jarak Euclidean antara dua set landmark mata vertikal
    const A = Math.sqrt(
      Math.pow(eyeLandmarks[1].x - eyeLandmarks[5].x, 2) +
        Math.pow(eyeLandmarks[1].y - eyeLandmarks[5].y, 2),
    )
    const B = Math.sqrt(
      Math.pow(eyeLandmarks[2].x - eyeLandmarks[4].x, 2) +
        Math.pow(eyeLandmarks[2].y - eyeLandmarks[4].y, 2),
    )

    // Hitung jarak Euclidean antara landmark mata horizontal
    const C = Math.sqrt(
      Math.pow(eyeLandmarks[0].x - eyeLandmarks[3].x, 2) +
        Math.pow(eyeLandmarks[0].y - eyeLandmarks[3].y, 2),
    )

    // Hitung Rasio Aspek Mata (EAR)
    const ear = (A + B) / (2 * C)
    return ear
  }

  const takePhoto = () => {
    const video = webcamRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)

          // Set the Blob URL as the src for local preview
          capturedPhotoRef.current = {}
          capturedPhotoRef.current.src = imageUrl
          setFoto(imageUrl)

          // Optionally, you can handle the blob or send it to a server
          // For example, you can use the FormData API to include it in a form submission
          const formData = new FormData()
          formData.append('photo', blob, 'captured_photo.png')
          // Now you can send formData to your server
        }
      }, 'image/png')

      showReport()
    }
  }

  const showReport = async () => {
    await setReportOn(true)
    setTimeout(() => {
      setReportOn(false)
    }, 15000)
  }

  const manualCapture = () => {
    takePhoto()
    setCamOn(false)
    stopVideo()
  }

  return (
    <div className="flex flex-col gap-4 justify-between items-center p-8 h-screen relative">
      <Link href="/reports">
        <button
          className="absolute right-5 top-5 bg-gray-500 hover:bg-gray-700
          text-white font-bold py-2 px-4 rounded"
        >
          Reports
        </button>
      </Link>
      <div className="flex grow justify-center">
        {camOn && (
          <div name="webcam-div" className="flex items-center relative">
            <video crossOrigin="anonymous" ref={webcamRef} autoPlay></video>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-22 z-10 border-5 border-purple-600"
            />
          </div>
        )}
        {reportOn && (
          <div name="report-div" className="flex items-center">
            <img src={foto} alt="ini foto" />
            <div className="px-8 text-2xl font-normal">
              <p>nama: nama dummy</p>
              <p>unit: unit dummy A2</p>
              <p>waktu presensi: dummy 07:28</p>
              <p>ketepatan waktu: tepat waktu</p>
              <p>ekspresi: {hasilPresensi}</p>
            </div>
          </div>
        )}
      </div>
      <div name="clock-and-info" className="grid justify-items-center gap-2">
        <button
          type="button"
          className={`${camOn ? 'bg-gray-500' : 'bg-blue-500'} ${
            camOn ? 'hover:bg-blue-700' : 'hover:bg-gray-700'
          } text-white font-bold py-2 px-4 rounded mb-4`}
          onClick={camOn ? handleOff : handleOn}
        >
          {`${camOn ? 'Matikan' : 'Nyalakan'}`} Kamera
        </button>
        <button
          className="bg-emerald-700 py-2 px-4 rounded"
          onClick={manualCapture}
        >
          Take Photo
        </button>
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
