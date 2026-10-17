import styles from "./SideText.module.scss"

function SideText({title, text, image}: {
    title: string;
    text: string;
    image: string
}) {

    return (
        <div className={styles.wrapper}>
            <img src={image} alt={"SideText img"}/>
            <p className={styles.title}>{title}</p>
            <p className={styles.text}>{text}</p>
        </div>
    )
}

export default SideText
