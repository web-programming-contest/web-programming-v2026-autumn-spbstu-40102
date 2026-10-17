import styles from "./Arrow.module.scss"

function Arrow({isForward, onClick}: {isForward: boolean; onClick: () => void}) {
    const d = isForward ? "M4.5 4.5L28.5 26.5L4.5 48.5" : "M28.5 4.5L4.5 26.5L28.5 48.5";

    return (
        <>
            <button
                className={styles.arrow}
                onClick= {() => onClick()}
            >
                <svg width="33" height="53" viewBox="0 0 33 53" fill="none">
                    <path d={d} stroke="rgba(17, 94, 251, 0.85)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </>
    );
}

export default Arrow