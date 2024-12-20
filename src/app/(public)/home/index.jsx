'use client'
import { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useGetList, usePost } from '~/services/dashboard'
import Loading from '~/components/loading'
import { calculateEAR } from '~/helpers/utils'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import HomeLayout from '~/app/(authenticated)/components/layoutHome'
const Clock = dynamic(() => import('../../../components/Clock'))

function Root() {
  const [camOn, setCamOn] = useState(false)
  const [reportOn, setReportOn] = useState(false)
  const [foto, setFoto] = useState()
  const [user, setUser] = useState()
  const [entryTime, setEntryTime] = useState()
  const [enterExit, setEnterExit] = useState()
  const [isPunctual, setIsPunctual] = useState()
  const [ekspresi, setEkspresi] = useState()
  const [errMessage, setErrMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [faceMatcher, setFaceMatcher] = useState(null)
  const [intervalId, setIntervalId] = useState(null)
  // STATE UNTUK COUNTDOWN
  const [countdown, setCountdown] = useState(30)
  const [countdownIntervalId, setCountdownIntervalId] = useState(null)
  //STATE UNTUK BLINK LEBIH DARI 3 DETIK
  const [blinkStartTime, setBlinkStartTime] = useState(null)
  const [blinkFrames, setBlinkFrames] = useState(0)

  const capturedPhotoRef = useRef()
  const webcamRef = useRef()
  const canvasRef = useRef()

  /////  simpan Mac Address di localStorage dan GET /address  /////
  const [thisDevice, setThisDevice] = useState()
  const [isLoadingAddress, setIsLoadingAddress] = useState(true)
  const [isStoredMac, setIsStoredMac] = useState(false)
  const [macAddress, setMacAddress] = useState()
  // const [isSuccessAddress, setIsSuccessAddress] = useState(false)
  // Ambil dan simpan MAC address di localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const receivedMacAddress = urlParams.get('mac_address')
  if (receivedMacAddress) {
    localStorage.setItem('macAddress', receivedMacAddress.toLowerCase())
  }

  // Cek localStorage saat load Home page
  useEffect(() => {
    const storedMacAddress = localStorage.getItem('macAddress')
    if (!storedMacAddress) {
      // console.log('Tidak ada Mac Address tersimpan.')
      toast.error('Tidak ada Mac Address tersimpan.')
      setIsLoadingAddress(false)
    } else {
      setMacAddress(storedMacAddress)
      setIsStoredMac(true)

      // AMBIL DATA PERANGKAT PRESENSI DARI DATABASE
      axios
        .get(`/api/address/${storedMacAddress}`)
        .then((response) => {
          setThisDevice(response.data)
          // console.log('res axios', response.data)
          // setIsSuccessAddress(true);
        })
        .catch((error) => {
          console.error('Error fetching data', error)
          // toast.error('Error fetching data', error)
        })
        .finally(() => {
          setIsLoadingAddress(false)
        })
    }
  }, [])
  ///// simpan Mac Address di localStorage dan GET /address /////

  // AMBIL DATA USER BESERTA DESCRIPTOR WAJAH USER DARI DATABASE
  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useGetList('users', {
    filter: { role: { not: 'SUPERADMIN' }, isDeleted: false },
  })
  // FUNGSI UNTUK UPLOAD REPORT PRESENSI
  const { mutateAsync: postReport } = usePost('reports')
  // FUNGSI UNTUK UPLOAD FOTO REPORT PRESENSI
  const { mutateAsync: uploadFile } = usePost('upload')

  // FUNGSI INI JALAN SETELAH GET /USERS SELESAI
  useEffect(() => {
    const setupFaceRecognition = async () => {
      if (isSuccessUsers) {
        try {
          // Load labeled face descriptors and create a FaceMatcher
          const labeledFaceDescriptors = await loadLabeledFaceDescriptors()
          setFaceMatcher(new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6))
        } catch (error) {
          console.error('Error setting up face recognition:', error)
        }
      }
    }

    //AMBIL MODELS FACE-API.JS
    const loadModels = () => {
      return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(setupFaceRecognition)
    }

    // AMBIL DATA FACE DESCRIPTOR USERS
    const loadLabeledFaceDescriptors = async () => {
      if (isSuccessUsers) {
        const labeledFaceDescriptors = []

        for (const item of users.data) {
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
        return labeledFaceDescriptors
      }
    }
    loadModels()
  }, [users])

  // FUNGSI UNTUK TOMBOL NYALAKAN KAMERA
  const handleOn = async () => {
    setCamOn(true)
    startVideo()
    // SET COUNTDOWN 30 DETIK KETIKA CAMERA DIMULAI
    setCountdown(30)
    reportOn && setReportOn(false)
    setEntryTime(null)
    setEnterExit(null)
    setIsPunctual(null)
    setEkspresi(null)
    setErrMessage(null)
    setSuccessMessage(null)
  }

  // FUNGSI UNTUK TOMBOL MATIKAN KAMERA
  const handleOff = async () => {
    setCamOn(false)
    stopVideo()
    reportOn && setReportOn(false)
  }

  // FUNGSI STOP WEBCAM
  const stopVideo = () => {
    // if (countdownIntervalId) {
    //   clearInterval(countdownIntervalId)
    //   setCountdownIntervalId(null)
    // }
    stopDetectMyFace()
    const stream = webcamRef?.current?.srcObject
    const tracks = stream?.getTracks()

    tracks?.forEach((track) => {
      track?.stop()
    })

    webcamRef.current.srcObject = null
  }

  // FUNGSI START WEBCAM
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

  // FUNGSI STOP DETEKSI WAJAH
  const stopDetectMyFace = () => {
    clearInterval(intervalId)
    // CODE COUNTDOWN
    clearInterval(countdownIntervalId)
  }

  // FUNGSI START COUNTDOWN 30 DETIK MATI OTOMATIS KETIKA TIDAK ADA WAJAH TERDETEKSI
  const startCountdown = () => {
    if (countdownIntervalId) clearInterval(countdownIntervalId)
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id)
        }
        return prev - 1
      })
    }, 1000)
    setCountdownIntervalId(id)
  }

  //JIKA COUNTDOWN HABIS DAN KAMERA MASIH ON, BELUM DIMATIKAN OTOMATIS KARENA PRESENSI, MAKA MATIKAN KAMERA
  useEffect(() => {
    if (countdown < 1 && !!camOn) {
      setCamOn(false)
      stopVideo()
    }
  }, [countdown])

  // FUNGSI DETEKSI WAJAH (FUNGSI UTAMA)
  const detectMyFace = () => {
    const webcam = webcamRef.current
    const canvas = canvasRef.current

    if (intervalId) clearInterval(intervalId)
    // START COUNTDOWN 30 SECONDS
    startCountdown()

    // setIntervalId(null)
    const id = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor()

      if (detections) {
        // RESET COUNTDOWN KE 30 DETIK KETIKA ADA WAJAH TERDETEKSI
        setCountdown(30)

        const resizedDetections = faceapi.resizeResults(detections, {
          width: webcam.offsetWidth,
          height: webcam.offsetHeight,
        })
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        // GAMBAR TITIK-TITIK DETEKSI WAJAH
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        // FUNGSI FACE RECOGNITION / PENGENALAN WAJAH DENGAN DESCRIPTOR DARI WAJAH USERS YANG SUDAH DIREKAM
        if (faceMatcher && !!detections?.descriptor?.length) {
          const bestMatch = faceMatcher.findBestMatch(detections.descriptor)

          const nama = bestMatch.label.split(' / ')[0]
          const nip = bestMatch.label.split(' / ')[1]
          const confidence = 1 - bestMatch.distance

          // JIKA KEMIRIPAN LEBIH DARI 60% MAKA TAMPILKAN "NAMA (..%)"
          // KURANG DARI ITU TAMPILKAN "tidak dikenali"
          const text =
            confidence >= 0.6
              ? `${nama} (${Math.round(confidence * 100)})%`
              : 'tidak dikenali'

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
          // SETELAH WAJAH TERDETEKSI DENGAN KEMIRIPAN LEBIH DARI 60%
          if (confidence >= 0.6) {
            // LANJUT DETEKSI KEDIPAN USER
            detectBlink(detections, nip)
          }
        }
      }
    }, 100)

    setIntervalId(id)
  }

  // FUNGSI DETEKSI KEDIPAN
  const detectBlink = async (detections, nip) => {
    const now = new Date()
    try {
      const leftEye = detections.landmarks.getLeftEye()
      const rightEye = detections.landmarks.getRightEye()

      const leftEAR = calculateEAR(leftEye)
      const rightEAR = calculateEAR(rightEye)

      const avgEAR = (leftEAR + rightEAR) / 2

      // BATAS JARAK TITIK-TITIK MATA DIANGGAP BLINK/KEDIP
      const threshold = 0.285

      if (avgEAR < threshold) {
        // BLINK DETECTED

        // COCOKKAN NIP DARI FACE DESCRIPTOR DENGAN USER TERDAFTAR DI DATABASE
        const userData = await users.data.find((u) => u.nip === nip)
        await setUser(() => userData)
        // TAMPILKAN USER YANG TERDETEKSI DI CONSOLE
        console.log('user terdeteksi', userData);
        

        // AMBIL EKSPRESI PALING DOMINAN
        let obj = detections.expressions
        const expression = Object.keys(obj).reduce((a, b) =>
          obj[a] > obj[b] ? a : b,
        )
        await setEkspresi(expression)

        // AMBIL JAM MENIT DETIK WAKTU PRESENSI DILAKUKAN
        const time =
          now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
        setEntryTime(time)

        // JIKA WAJAH YANG TERDETEKSI DIKENALI SEBAGAI USER TERDAFTAR DI DATABASE, LANJUT AMBIL FOTO
        if (userData.id) {
          await takePhoto(now, userData, expression)
        }

        // MULAI DETEKSI JIKA BLINK TERLALU LAMA
        if (!blinkStartTime) {
          setBlinkStartTime(now)
          setBlinkFrames(1)
        } else {
          setBlinkFrames((prev) => prev + 1)
        }

        // CEK JIKA BLINK TIDAK VALID (LEBIH DARI 3 DETIK)
        // Masuk ke kondisi ini bisa dibilang mustahil karena detectBlink hanya dijalankan jika wajah terdeteksi adalah user terdaftar. Dan jika user terdaftar sudah blink maka akan dilanjut proses presensi ambil foto dan POST report.
        if (blinkFrames * 100 >= 3000) {
          console.log('Invalid Blink: More than 3 seconds')
          setBlinkStartTime(null)
          setBlinkFrames(0)
          return // INVALID BLINK
        }
      } else {
        // RESET BLINK TRACKING (MEREM TERLALU LAMA) JIKA MATA TERBUKA
        setBlinkStartTime(null)
        setBlinkFrames(0)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  // FUNGSI AMBIL FOTO
  const takePhoto = (now, userData, expression) => {
    const video = webcamRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      //LANGSUNG MATIKAN KAMERA SETELAH DAPAT GAMBAR, PROSES DILANJUT SETELAH STOP KAMERA
      setCamOn(false)
      stopVideo()
      // UBAH FOTO DARI CANVAS KE BLOB, UNTUK JADI FILE YANG BISA DIUPLOAD
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          // CONVERT BLOB MENJADI FILE YANG BISA DIUPLOAD
          const myFile = new File([blob], 'photo', { type: 'image/png' })
          // PROSES UPLOAD REPORT SEKALIAN SETELAH DAPAT FOTO
          uploadReport(now, userData, expression, myFile)
          // SET BLOB SEBAGAI FOTO PREVIEW UNTUK DITAMPILKAN DI LAYAR
          capturedPhotoRef.current = {}
          capturedPhotoRef.current.src = imageUrl
          setFoto(imageUrl)
        }
      })
      // TAMPILKAN REPORT DI LAYAR PRESENSI
      showReport()
    }
  }

  // FUNGSI UPLOAD/POST REPORT PRESENSI
  const uploadReport = async (now, userData, expression, myFile) => {
    const device = thisDevice
    try {
      // HENTIKAN PROSES DI SINI JIKA KAMPUS DAN UNIT USER TIDAK COCOK DENGAN KAMPUS DAN UNIT MESIN PRESENSI
      if (
        userData?.kampusId !== device?.kampusId ||
        userData?.unitId !== device?.unitId
      ) {
        // JIKA USER BUKAN WHITELIST MAKA PROSES PRESENSI DIHENTIKAN, JIKA WHITELIST MAKA TETAP LANJUT
        if (!userData?.whitelist) {
          throw new Error('Presensi gagal. Anda tidak terdaftar di unit ini.')
        }
      }
      const payload = {
        timestamp: now,
        ekspresi: expression,
        userId: userData?.id,
        kampusId: device?.kampusId,
        unitId: device?.unitId,
      }
      // POST PRESENSI
      const res = await postReport(payload)
      // JIKA PRESENSI BERHASIL, AMBIL ID PRESENSI UNTUK UPLOAD FOTO UNTUK DIKAITKAN DENGAN REPORT PRESENSI
      if (res?.id) {
        setEnterExit(res?.enterExit)
        setIsPunctual(res?.isPunctual)
        const formData = new FormData()
        formData.append('file', myFile)
        formData.append('reportId', res.id)
        await uploadFile(formData)
      }
      // SET PESAN BERHASIL PRESENSI
      toast.success('Presensi Sukses!')
      setSuccessMessage('Presensi Sukses!')
    } catch (error) {
      // SET PESAN ERROR JIKA PRESENSI DITOLAK ATAU TERJADI ERROR SERVER ATAU JARINGAN
      const errMsg = error?.response?.data?.message || error.message
      console.log(errMessage)
      setErrMessage(errMsg)
      toast.error(errMsg)
    }
  }

  // TAMPILKAN PREVIEW REPORT PRESENSI BARUSAN SELAMA 10 DETIK
  const showReport = async () => {
    await setReportOn(true)
    setTimeout(() => {
      setReportOn(false)
    }, 10000)
  }

  // CEK JIKA SESI LOGIN AKTIF
  const { data: sessionData } = useSession()
  const role = sessionData?.user?.role

  // AWAL HALAMAN DIMUAT KETIKA MASIH CEK 'APAKAH PERANGKAT TERDAFTAR UNTUK PRESENSI', HANYA AKAN MENAMPILKAN LOADING
  if (isLoadingAddress) {
    return <Loading />
  }
  return (
    <HomeLayout>
      {/* JIKA PERANGKAT TIDAK TERDAFTAR UNTUK PRESENSI MAKA AKAN MENAMPILKAN INFO */}
      {!thisDevice?.id ? (
        <div className="grid gap-4 justify-items-center content-center h-screen relative text-xl font-normal">
          {!isStoredMac ? (
            // KETIKA TIDAK ADA MAC ADDRESS DI LOCAL STORAGE
            <p>Mac Address tidak terdeteksi.</p>
          ) : (
            // KETIKA ADA MAC ADDRESS DI LOCAL STORAGE, TAPI TIDAK COCOK DENGAN DATABASE DEVICES
            <div>
              <p>Perangkat ini tidak terdaftar sebagai perangkat presensi.</p>
              <p>
                Silakan{' '}
                <Link
                  href="/login"
                  className="duration-150 ease-in-out hover:text-sky-800 hover:font-bold underline underline-offset-1"
                >
                  LogIn
                </Link>{' '}
                untuk ke halaman dashboard
              </p>
            </div>
          )}
          <div className="absolute bottom-8">
            <Clock />
          </div>
        </div>
      ) : (
        // JIKA PERANGKAT TERDAFTAR, BARU AKAN DITAMPILKAN TOMBOL KAMERA DAN INFO KAMPUS DAN UNIT MANA PERANGKAT INI DIPERUNTUKKAN
        <div className="flex flex-col gap-4 justify-between items-center p-8 h-screen relative">
          {/* COUNTDOWN*/}
          {!!camOn && (
            <div className="absolute left-5 top-5 font-medium">
              <span className="text-2xl font-bold">{countdown}</span> detik
            </div>
          )}
          <div className="flex grow justify-center">
            {/* CAMERA / WEBCAM */}
            {!!camOn && (
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
              <div className="grid justify-items-center">
                {/* PESAN ERROR ATAU SUKSES PRESENSI */}
                {!!errMessage ? (
                  <div
                    className={`flex items-center bg-red-400 w-fit h-fit mt-16`}
                  >
                    <div className={`bg-red-600 h-10 w-2.5`} />
                    <p className="text-xl font-normal px-5">
                      {errMessage || successMessage}
                    </p>
                  </div>
                ) : (
                  !!successMessage && (
                    <div
                      className={`flex items-center bg-green-300 w-fit h-fit mt-16`}
                    >
                      <div className={`bg-green-500 h-10 w-2.5`} />
                      <p className="text-xl font-normal px-5">
                        {errMessage || successMessage}
                      </p>
                    </div>
                  )
                )}
                {/* FOTO DAN INFO PRESENSI */}
                <div name="report-div" className="flex items-center">
                  <img src={foto} alt="ini foto" />
                  <div className="px-8 text-xl space-y-1.5 font-normal">
                    {!!enterExit && (
                      <p className="text-2xl font-semibold">
                        {' '}
                        Presensi {enterExit}
                      </p>
                    )}
                    <p>Nama: {user?.name}</p>
                    <p>NIP: {user?.nip}</p>
                    <p>
                      Jabatan:
                      {user?.position?.charAt(0) +
                        user?.position?.slice(1).toLowerCase()}
                    </p>
                    <p>Waktu Presensi: {entryTime}</p>
                    {!!isPunctual && <p>Ketepatan Waktu: {isPunctual}</p>}
                    <p>Ekspresi: {ekspresi}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* TAMPILKAN LAYER LOADING KETIKA DESCRIPTOR BELUM SELESAI DIMUAT */}
          {isLoadingUsers ||
          (isSuccessUsers && users.data.length && faceMatcher == null) ? (
            <Loading />
          ) : // KETIKA TIDAK ADA DATA USER UNTUK DESCRIPTOR TAMPILKAN INFO TIDAK ADA DATA USER
          isSuccessUsers && !users.data.length ? (
            <div className="grid gap-4 h-full content-center text-center text-xl font-normal">
              <p>Tidak ada data user yang terdaftar untuk persensi.</p>
              {/* JIKA SESI LOGIN AKTIF & ROLE = SUPERADMIN / ADMIN, TAMPILKAN LINK KE REGISTER USER */}
              {(role === 'SUPERADMIN' || role === 'ADMIN') && (
                <Link
                  href="/register"
                  className="duration-150 ease-in-out hover:text-sky-800 hover:font-bold underline underline-offset-1"
                >
                  Daftarkan User
                </Link>
              )}
            </div>
          ) : (
            // TAMPILKAN TOMBOL KAMERA JIKA DESCRIPTOR SUDAH SIAP
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
          <div
            name="clock-and-info"
            className="grid justify-items-center gap-2"
          >
            {/* JAM */}
            <Clock />
            {/* INFO KAMPUS DAN UNIT PERANGKAT PRESENSI */}
            {!!thisDevice?.id && (
              <div className="grid justify-items-center text-lg">
                <div>
                  Kampus:{' '}
                  <span className="font-semibold">
                    {thisDevice?.kampus?.name}
                  </span>
                </div>
                <div>
                  Unit:{' '}
                  <span className="font-semibold">
                    {thisDevice?.unit?.name}
                  </span>
                </div>
              </div>
            )}
            {/* <p>
              MAC Address:{' '}
              {macAddress ? macAddress : 'Waiting for MAC address...'}
            </p> */}
          </div>
        </div>
      )}
    </HomeLayout>
  )
}
export default Root
