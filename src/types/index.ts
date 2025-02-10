export type TTask = {
    id: number;
    name: string;
    description: string;
    isDone: boolean;
};

export type TCategory = {
    id: number;
    name: string;
    tasks: TTask[];
}