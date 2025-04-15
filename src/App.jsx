import { useState, useRef } from 'react'
import heart from './assets/heart.png';
import Sparkles from './sparkle';
import FlyingText from './FlyingText';

function App() {
  const imgRef = useRef(null);
  const [heartSize, setHeartSize] = useState(20);
  const [clickCount, setClickCount] = useState(0);
  const texts = [
    'Halo sayangku',
    'I love you yaa',
    'Ta sayang skali ngana! 💕',
    'Ta cinta skali ngana sayangku',
    'Sayang terus kt ya',
    'Cuma boleh kt!',
    '💕💕💕I love you💕💕💕',
    'cape kang kerja?',
    'tetap smangat ya sayang!💕',
    'Gambaran ta p jantung kalo lia ngana 💕'
  ]

  const handleClick = () => {
    setHeartSize(heartSize<90 ? heartSize+7 : 90)
    setClickCount(clickCount<10 ? clickCount+1 : 10)
  }

  return (
    <div className='h-screen relative flex flex-col justify-center items-center overflow-hidden' style={{width: '100vw'}}>
      <h1 className='absolute top-10 text-xl font-bold'>💕Halo Aldoku Sayang💕</h1>
      <span className='absolute top-10 mt-7 text-sm font-normal'>Sebesar tu cinta sayang 🤣 *hehe</span>
      <Sparkles sparkling={clickCount===10}>
        <img
          ref={imgRef}
          src={heart}
          style={{width: `${heartSize}%`}}
          onClick={() => handleClick()}
          className={clickCount===10 && 'animate' || ''}
        />
        <FlyingText
        triggerCount={clickCount}
        texts={texts}
        originRef={imgRef}
      />
      </Sparkles>
      { clickCount===10 &&
        <div className='absolute bottom-30 font-semibold text-sm flex flex-col justify-center text-wrap p-3'>
          I love you with all my heart and being Aldoku 💕, sehat selalu ya, bahagia selalu juga, semoga selalu dilimpahkan rezeki,kesehatan dan kebahagiaan selama di dunia dan di akhirat, Aamiin 💕
          <span className='font-bold mt-2'>btw ta mau es krim nnti 🙏</span>
        </div>
      }
      <div className={`absolute bottom-5 flex ${clickCount===10 ? 'justify-between' : 'justify-center'} px-3 items-center bg-red-50/70 w-70 h-10 rounded-md text-stone-700`}>
        <p className='font-bold'>Clicked <span className='bg-red-100 px-2 py-1 ml-2'>{clickCount}/10</span></p>
        {clickCount===10 &&
          <span className='bg-red-100 p-1 font-bold text-sm rounded-md' onClick={() => {setClickCount(0); setHeartSize(20)}}>Reset</span>
        }
      </div>
    </div>
  )
}

export default App
