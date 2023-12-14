//import imgUrl from '../assets/imgs/react.png'
import imgUrl from '../assets/imgs/home-image.jpg'

export function Home() {
    return (
        <section className="home">
            <h1>Welcome to my <span>CoolEmail</span> App</h1>
            <img src={imgUrl} alt="Welcome" />
        </section>
    )
}
