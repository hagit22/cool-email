
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

// Pages
import { Home } from './pages/Home'
import { AboutUs } from './pages/AboutUs';
import { EmailIndex } from './pages/EmailIndex';

// Components
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { Toast } from './cmps/Toast'
import { AboutComp } from './cmps/AboutComp';
import { AboutApp } from './cmps/AboutApp';


export function App() {

    return (
        <Router>
            <section className='main-app'>
                <AppHeader />
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/about" element={<AboutUs/>}>
                            <Route path='/about/company' element={<AboutComp/>} />
                            <Route path='/about/app' element={<AboutApp/>} />
                        </Route>
                        <Route path="/email/:box?" element={<EmailIndex/>} />
                        <Route path="/email/:box/:details" element={<EmailIndex/>} />
                    </Routes>
                </main>
                <Toast/>
                <AppFooter/>
            </section>
        </Router>


    )
}

