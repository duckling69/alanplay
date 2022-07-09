import React from 'react'
import styled from 'styled-components'
import useAuth from "./useAuth"

const Styles = styled.a`
#dashboard{
    background-image: conic-gradient(from 105.52deg at -25.49% 32.81%, #2F91D8 -23.28deg, #C75E71 12.54deg, #2F91D8 336.72deg, #C75E71 372.54deg);

}
`

export default function DashBoard({code}) {
  const accessToken = useAuth(code)
  return (
    <Styles>
<div id='dashboard' className='bg-none max-w-[100vw] w-[100vw] h-[100vh]'>
  <div ></div>
  </div>
  </Styles>
  )

}
