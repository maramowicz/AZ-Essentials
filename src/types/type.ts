export interface LessonTypes {
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

export interface MajorTypes {
    degree: string | null;
    doc_type: number;
    groups: string[];
    name: string | null;
    plan: LessonTypes[][];
    semester: string | null;
    type: string | null;
    year: string | null;
}

export interface DynamicSearchProps {
    returnToMenu: () => void;
    searchType: string;
    firstTryFetchingData?: MajorTypes[];
}
