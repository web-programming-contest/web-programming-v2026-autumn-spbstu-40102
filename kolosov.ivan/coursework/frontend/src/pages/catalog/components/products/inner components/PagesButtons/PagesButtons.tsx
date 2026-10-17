import styles from "./PagesButtons.module.scss"
import type {PageItem} from "../../types.ts";
import type {Dispatch, SetStateAction} from "react";

function PagesButtons({currentPage, pagesToShow, onClick}: {currentPage: number, pagesToShow: PageItem[], onClick: Dispatch<SetStateAction<number>>}) {

    return (
        <div className={styles.buttons}>
            {pagesToShow.map(((page, index) =>
                page === "..." ? (
                    <span key={`dots-${index}`}>…</span>
                ) :
                    <button key={page} onClick={() => onClick(page)} className={page === currentPage ? styles.active : ""}>
                        {page}
                    </button>
                )
            )}
        </div>
    )
}

export default PagesButtons
