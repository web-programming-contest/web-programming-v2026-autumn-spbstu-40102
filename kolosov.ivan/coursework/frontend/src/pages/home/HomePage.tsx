import Banner from "./components/banner/Banner.tsx"
import Carousel from "./components/carousel/Carousel.tsx";
import SideText from "./components/side info/SideText.tsx";
import styles from "./Home.module.scss"
import Advantages from "./components/advantages/Advantages.tsx";
import Info from "./components/info/Info.tsx";

function HomePage() {

    return (
        <main className="container">
            <div className={styles.homePage}>
                <Banner/>
                <div className={styles.wrapper}>
                    <SideText
                        title="Хиты продаж"
                        text="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
                        image="src/assets/images/icons/fire.png"
                    />
                    <Carousel label="is_bestseller"/>
                </div>
                <div className={styles.wrapper}>
                    <SideText
                        title="Новинки"
                        text="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники"
                        image="src/assets/images/icons/new.png"
                    />
                    <Carousel label="is_new"/>
                </div>
                <Advantages/>
                <Info/>
                <p></p>
            </div>
        </main>
    )
}

export default HomePage
