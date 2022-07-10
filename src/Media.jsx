import { useState, useRef ,useEffect} from 'react'
// import song from './Suncrown - Legend of the Forgotten Centuries.mp3'
import Slider from './components/slider/Slider'
import ControlPanel from './components/ControlButtons/ControlPanel'
import './Media.css';
import {AiOutlineStar} from 'react-icons/ai';
import {FiRefreshCcw} from 'react-icons/fi';
import useAuth from "./useAuth"
import Player from './Player';
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios"
import TrackSearchResult from "./TrackSearchResult"

const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
})

function Media({code}) {
  const accessToken = useAuth(code)
  const[isLiked,setIsLiked]=useState(false);
  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")

  const audioRef = useRef()

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }
  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }
  useEffect(() => {
    if (!playingTrack) return

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])
  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  const play = () => {
    const audio = audioRef.current
    audio.volume = 0.1

    if (!isPlaying) {
      setIsPlaying(true)
      audio.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }
  }

  const getCurrDuration = (e) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  return (
    <div className='app-container'>
      <div className='header'>
        <a className='reload'><FiRefreshCcw /></a>
      <h3>Song Name</h3>
      <a className={isLiked?'liked':'like'} onClick={() => {
          setIsLiked(!isLiked);
        }}><AiOutlineStar/></a>
        </div>
        <h5>Artist Name</h5>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        ref={audioRef}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        src=""
      ></audio>
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
      />
    </div>
  )
}

export default Media