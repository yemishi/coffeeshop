import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useScrollQuery from "./useInfiniteQuery";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
global.IntersectionObserver = class {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
} as any;
global.fetch = jest.fn()

describe("useScrollQuery", () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it("fetches initial data", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: ["item1", "item2"], hasMore: true }),
        });

        const { result } = renderHook(() =>
            useScrollQuery({ queryKey: ["test"], url: "/api/data" })
            , { wrapper });

        await waitFor(() => expect(result.current.values.length).toBe(2));
        expect(result.current.values).toEqual(["item1", "item2"]);
    });

    it("fetches more data on scroll", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: ["item1", "item2"], hasMore: true }),
        });
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: ["item3", "item4"], hasMore: false }),
        });

        const { result } = renderHook(() =>
            useScrollQuery({ queryKey: ["test"], url: "/api/data" })
            , { wrapper });

        await waitFor(() => expect(result.current.values.length).toBe(2));

        act(() => {
            result.current.fetchNextPage();
        });

        await waitFor(() => expect(result.current.values.length).toBe(4));
        expect(result.current.values).toEqual(["item1", "item2", "item3", "item4"]);
    });

    it("handles fetch error", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Error fetching data" }),
        });

        const { result } = renderHook(() =>
            useScrollQuery({ queryKey: ["test"], url: "/api/data" })
            , { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));
    });
});
