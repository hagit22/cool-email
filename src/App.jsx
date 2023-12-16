
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

// Pages
import { Home } from './pages/Home'
import { AboutUs } from './pages/AboutUs';
import { EmailIndex } from './pages/EmailIndex';
import { SingleEmailContainer } from './pages/SingleEmailContainer';

// Components
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { AboutComp } from './cmps/AboutComp';
import { AboutApp } from './cmps/AboutApp';


export function App() {

    return (
        <Router>
            <section className='main-app'>
                <AppHeader />
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />}>
                            <Route path='/about/company' element={<AboutComp />} />
                            <Route path='/about/app' element={<AboutApp />} />
                        </Route>
                        <Route path="/email" element={<EmailIndex/>} />
                        <Route path="/email/:details" element={<SingleEmailContainer/>} />
                        <Route path="/email/compose" element={<SingleEmailContainer/>} />
                    </Routes>
                </main>
                <AppFooter />
            </section>
        </Router>


    )
}

