import type {PageItem} from "../types.ts";

export function getPages(currentPage: number, totalPages: number): PageItem[] {
    let leftDots: boolean = false
    let rightDots: boolean = false
    if(totalPages > 3) {
        if(currentPage > 3) {
            leftDots = true
        }
        if (totalPages - currentPage > 2) {
            rightDots = true
        }
    }

    if (leftDots && rightDots) {
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    }
    else if (leftDots && !rightDots) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages]
    }
    else if (rightDots) {
        return [1, 2, 3, "...", totalPages]
    }
    else {
        let result: PageItem[] = []

        for (let i = 1; i <= totalPages; ++i) {
            result.push(i)
        }

        return result
    }
}