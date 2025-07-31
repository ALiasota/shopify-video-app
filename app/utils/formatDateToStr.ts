export const formatDateToStr = (dateStr: string) => {
    const date = new Date(dateStr.replace(" ", "T"));

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);
    return formatted;
};
