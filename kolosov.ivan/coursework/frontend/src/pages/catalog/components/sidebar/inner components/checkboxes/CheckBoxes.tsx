import type {CheckBoxData} from "../../../../../../dtos/CheckBoxData.ts";
import styles from "./CheckBoxes.module.scss"

function CheckBoxes({toShow, name}: {toShow: CheckBoxData[], name: string}) {
    return (
        <div className={styles.checkBoxes}>
            {toShow.map((item) => (
                <label key={item.engString}>
                    <input type="checkbox" name={name} value={item.engString} />
                    {item.ruString}
                </label>
            ))}
        </div>
    )
}

export default CheckBoxes