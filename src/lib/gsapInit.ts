import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

gsap.defaults({
  ease: 'power2.out',
  overwrite: 'auto',
})

export { gsap, SplitText, ScrollTrigger }
