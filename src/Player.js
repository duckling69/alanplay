import React from 'react'
import { useState, useEffect } from "react"
import SpotifyWebPlayer from 'react-spotify-web-playback/lib'

const Player = ({ accessToken, trackUri}) => {
    const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])
    if (!accessToken) return null;
  return (
    <SpotifyWebPlayer
    token={accessToken}
    showSaveIcon
    uris={trackUri ? [trackUri] :[]}
    />
  )
}

export default Player