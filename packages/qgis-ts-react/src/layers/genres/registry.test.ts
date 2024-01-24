import { GenreRegistry } from "./registry";

describe("GenreRegistry", () => {
    let genreRegistry: GenreRegistry;

    beforeEach(() => {
        genreRegistry = new GenreRegistry();
    });

    it("should register a genre", () => {
        const genre = { id: "1", name: "Action" };
        genreRegistry.register(genre as any);
        expect(genreRegistry.getGenre("1")).toEqual(genre);
    });

    it("should remove a genre", () => {
        const genre = { id: "1", name: "Action" };
        genreRegistry.register(genre as any);
        genreRegistry.removeGenre("1");
        expect(() => genreRegistry.getGenre("1")).toThrow();
    });

    it("should get all genres", () => {
        const genre1 = { id: "1", name: "Action" };
        const genre2 = { id: "2", name: "Comedy" };
        genreRegistry.register(genre1 as any);
        genreRegistry.register(genre2 as any);
        const genres = genreRegistry.getGenres();
        expect(genres).toEqual({ "1": genre1, "2": genre2 });
    });
});
