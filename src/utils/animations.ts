const fadeAnimation = ({
    duration = 0.5,
    initial = {},
    exit = {}
}: {
    duration?: number;
    initial?: { y?: number | "top" | "bottom"; x?: number | "left" | "right" };
    exit?: { y?: number | "top" | "bottom"; x?: number | "left" | "right" };
}) => {
    const values = { bottom: 20, top: -20, left: -100, right: 100 };

    const parseValue = (value?: number | "top" | "bottom" | "left" | "right", fallback?: number) =>
        typeof value === "number" ? value : values[value as keyof typeof values] ?? fallback;

    return {
        initial: { opacity: 0, y: parseValue(initial.y, values.bottom), x: parseValue(initial.x, 0) },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: { opacity: 0, y: parseValue(exit.y, values.top), x: parseValue(exit.x, 0) },
        transition: { duration }
    };
};

export { fadeAnimation }