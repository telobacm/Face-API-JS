import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import * as faceapi from 'face-api.js'
import { toast } from 'react-toastify'

const RegisterCamera = ({ faceDescriptors, setFaceDescriptors }: any) => {
  const [camOn, setCamOn] = useState<boolean>(false)
  const [reportOn, setReportOn] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(5)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const setupFaceRecognition = async () => {
      try {
        await loadModels()
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

    setupFaceRecognition()
  }, [])

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
    if (webcamRef.current) {
      const stream = webcamRef.current?.srcObject as MediaStream
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach((track) => {
          track.stop()
        })
        webcamRef.current.srcObject = null
      }
    }
  }

  const startVideo = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        webcamRef.current!.srcObject = currentStream
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        detectMyFace()
      })
  }

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const stopDetectMyFace = () => {
    clearInterval(intervalId!)
  }

  const detectMyFace = () => {
    const webcam = webcamRef.current
    const canvas = canvasRef.current

    if (!webcam || !canvas) {
      return
    }

    setIntervalId(null)
    const id = setInterval(async () => {
      if (webcam && canvas) {
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

          if (canvas.getContext) {
            const context = canvas.getContext('2d')
            if (context) {
              context.clearRect(0, 0, canvas.width, canvas.height)

              faceapi.draw.drawDetections(canvas, resizedDetections)
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            }
          }
        }
      }
    }, 100)

    setIntervalId(id)
  }

  const takePhoto = async () => {
    const detections = await faceapi
      .detectSingleFace(
        webcamRef.current!,
        new faceapi.TinyFaceDetectorOptions(),
      )
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor()

    if (detections) {
      // Save face descriptors
      saveFaceDescriptors(detections.descriptor)
    }
  }

  // Save face descriptors
  const saveFaceDescriptors = (descriptor: any) => {
    setFaceDescriptors((faceDescriptors: any) => [
      ...faceDescriptors,
      descriptor,
    ])

    if (counter > 1) {
      setCounter((prevCounter) => prevCounter - 1)
      toast.success(`Take ${counter - 1} more photo(s) !`)
    } else {
      setCounter(0)
      toast.success(`5 photos added`)
      setCamOn(false)
      stopVideo()
    }
  }

  const submitData = () => {
    console.log('submitting data:', faceDescriptors)
  }

  return (
    <div className="flex flex-col gap-4 justify-between items-center p-8 h-5/6 relative">
      <div className="flex grow justify-center">
        {camOn && (
          <div className="flex flex-col justify-items-center space-y-8">
            <div className="flex items-center relative">
              <video crossOrigin="anonymous" ref={webcamRef} autoPlay></video>
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="absolute top-22 z-10 border-5 border-purple-600"
              />
            </div>
            <button
              type="button"
              className="bg-emerald-700 text-white font-bold py-2 px-4 mx-auto rounded"
              onClick={takePhoto}
            >
              Take Photo
            </button>
          </div>
        )}
      </div>
      {counter !== 0 && (
        <div className="grid justify-items-center gap-2">
          <button
            type="button"
            className={`${camOn ? 'bg-gray-500' : 'bg-blue-500'} ${
              camOn ? 'hover:bg-blue-700' : 'hover:bg-gray-700'
            } text-white font-bold py-2 px-4 rounded mb-4`}
            onClick={camOn ? handleOff : handleOn}
          >
            {`${camOn ? 'Matikan' : 'Nyalakan'}`} Kamera
          </button>
        </div>
      )}
    </div>
  )
}

export default RegisterCamera
