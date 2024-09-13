export type TTask = {
    id: number;
    name: string;
    description: string;
};

export type TCategory = {
    id: number;
    name: string;
    tasks: TTask[];
}