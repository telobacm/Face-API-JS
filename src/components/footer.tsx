'use client'
import React, { useEffect, useState } from 'react'
import {
  AiFillTwitterSquare,
  AiFillYoutube,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillFacebook,
} from 'react-icons/ai'
import Button from './button'
import { handleFetch } from '~/services/public'

const media = [
  { icon: <AiFillTwitterSquare />, href: 'https://twitter.com/atomionics ' },
  { icon: <AiFillYoutube />, href: 'https://www.youtube.com/@Atomionics' },
  { icon: <AiFillInstagram />, href: 'https://www.instagram.com/atomionics' },
  {
    icon: <AiFillLinkedin />,
    href: 'https://www.linkedin.com/company/atomionics',
  },
  {
    icon: <AiFillFacebook />,
    href: 'https://www.facebook.com/profile.php?id=100068521124431',
  },
]

function getIcon(data: any) {
  switch (data) {
    case 'twitter':
      return <AiFillTwitterSquare />
    case 'youtube':
      return <AiFillYoutube />
    case 'instagram':
      return <AiFillInstagram />
    case 'linkedin':
      return <AiFillLinkedin />
    case 'facebook':
      return <AiFillFacebook />
    default:
      return null // Mengembalikan null jika data tidak cocok dengan 'twitter' atau 'youtube'
  }
}

export default function Footer({ light }: any) {
  const [loading, setLoading] = useState(false)
  const [footerSocial, setFooterSocial] = useState([])
  const [footerData, setFooterData]: any = useState([])

  useEffect(() => {
    setLoading(true)

    async function fetchData() {
      try {
        // const params: any = { limit: 9, part }
        // if (category) {
        //   params.category = category
        // }
        // if (searchValue) {
        //   params.title = { like: searchValue }
        // }
        const FooterData = await handleFetch('content', {
          section: 'footer',
          active: true,
        })

        const FooterSocial = await handleFetch('social', {
          location: 'footer',
          active: true,
        })
        setFooterSocial(FooterSocial)
        setFooterData(FooterData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <footer
      className={`${
        !light
          ? 'text-white bg-gradient-to-r from-black via-[#161616] to-black'
          : 'bg-white'
      } `}
    >
      <div className="w-wrap py-[37px] lg:pt-[96px] lg:pb-[142px] px-[25px] lg:px-[153px] text-center">
        <div data-aos="fade-up" data-aos-duration="1000">
          <h6 className="text-xs lg:text-2xl font-bold ">
            Cannot find what you were looking for?
          </h6>
          <div>
            <a href="mailto:anirbanm@atomionics.com">
              <Button
                className={`mt-7 hover:bg-red-700 zoom-scale-110-fast ${
                  !!light ? 'hover:text-white' : 'text-white'
                }`}
              >
                Contact Us
              </Button>
            </a>
          </div>
          <div className="mt-12 lg:mt-10 flex gap-6 flex-col lg:flex-row justify-between lg:pt-10">
            <div className="flex flex-col gap-2 lg:gap-5 mx-auto lg:mx-0">
              <img
                src={light ? '/black-logo.png' : '/logo.png'}
                alt=""
                className="w-24 lg:w-[11.375rem] "
              />
              <p className="text-[10px] lg:text-lg">Matter-Waves Matter</p>
            </div>
            <div className="lg:w-1/3 text-[14px] lg:text-lg">
              <p>{!!footerData?.length && footerData[0]?.title}</p>
              <div
                className="font-extralight mt-2"
                dangerouslySetInnerHTML={{
                  __html: !!footerData?.length && footerData[0]?.description,
                }}
              />
              <div className="flex gap-4 justify-center mt-6 lg:mt-7">
                {!!footerSocial?.length &&
                  footerSocial?.map((v: any, i: any) => (
                    <a
                      target="_blank"
                      href={v.link}
                      key={i}
                      className={`text-[33px] rounded-2xl`}
                    >
                      {getIcon(v.category)}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
