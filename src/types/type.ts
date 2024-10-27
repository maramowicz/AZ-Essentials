interface Lesson {
    place: [];
    name: string;
    start_minute: number;
    end_minute: number;
    duration: number;
    whatever: string;
    type: string;
    teacher: string;
    subject: string;
    dates: string[];
}
interface MajorTypes {
    degree: string | null;
    doc_type: number;
    groups: string[];
    name: string | null;
    plan: Lesson[][];
    semester: string | null;
    type: string | null;
    year: number | null;
}

interface firstTryFetchingDataType {
    firstTryFetchingData: MajorTypes[] | undefined;
}

interface DynamicSearchProps {
    returnToMenu: () => void;
    searchType: 'teacher' | 'place';
    firstTryFetchingData: MajorTypes[] | undefined;
}