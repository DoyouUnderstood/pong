export interface RouteI {
    partial: string;
    authentification: "loginRequired" | "loginNotRequired";
    cleanup?(): void;
    setup(container: HTMLElement): Promise<void>;
} 

