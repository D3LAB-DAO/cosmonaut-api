type Base64 = string;
type CargoReturn = string | null;

interface FmtFiles {
    [key: string]: Base64
}

export {
    Base64,
    CargoReturn,
    FmtFiles
};