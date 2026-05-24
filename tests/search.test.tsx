
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchPage from "../app/search/page"// adjust path if needed


const MOVIE_ENDPOINT =
  "https://group-project-backend-group-4.onrender.com/api/movies/search";
const TV_ENDPOINT =
  "https://group-project-backend-group-4.onrender.com/api/tv/search";

const mockMovieResults = [
  { id: 1, title: "Inception", release_date: "2010-07-16", poster_path: "/poster1.jpg" },
  { id: 2, title: "Interstellar", release_date: "2014-11-07", poster_path: null },
];

const mockTvResults = [
  { id: 10, title: "Breaking Bad", release_date: "2008-01-20", poster_path: "/poster10.jpg" },
];

function buildSuccessResponse(results: typeof mockMovieResults) {
  return Promise.resolve(
    new Response(JSON.stringify({ page: 1, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
}

beforeEach(() => { jest.spyOn(global, "fetch"); });
afterEach(() => { jest.restoreAllMocks(); });

describe("SearchPage – initial render", () => {
  it("renders the search input", () => {
    render(<SearchPage />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders Movies and TV Shows buttons", () => {
    render(<SearchPage />);
    expect(screen.getByRole("button", { name: /movies/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tv shows/i })).toBeInTheDocument();
  });

  it("renders the Search submit button", () => {
    render(<SearchPage />);
    expect(screen.getByRole("button", { name: /^search$/i })).toBeInTheDocument();
  });

  it("does not show results or errors on first paint", () => {
    render(<SearchPage />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("SearchPage – media type selection", () => {
  it("highlights the Movies button when clicked", async () => {
    render(<SearchPage />);
    const moviesBtn = screen.getByRole("button", { name: /movies/i });
    await userEvent.click(moviesBtn);
    expect(moviesBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights the TV Shows button when clicked", async () => {
    render(<SearchPage />);
    const tvBtn = screen.getByRole("button", { name: /tv shows/i });
    await userEvent.click(tvBtn);
    expect(tvBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("un-highlights Movies when TV Shows is subsequently selected", async () => {
    render(<SearchPage />);
    const moviesBtn = screen.getByRole("button", { name: /movies/i });
    const tvBtn = screen.getByRole("button", { name: /tv shows/i });
    await userEvent.click(moviesBtn);
    await userEvent.click(tvBtn);
    expect(moviesBtn).toHaveAttribute("aria-pressed", "false");
    expect(tvBtn).toHaveAttribute("aria-pressed", "true");
  });
});


describe("SearchPage – successful movie search", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse(mockMovieResults));
  });

  it("calls the movies endpoint with the correct query", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${MOVIE_ENDPOINT}?title=inception`),
        expect.anything()
      );
    });
  });

  it("displays all returned movie titles", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
      expect(screen.getByText("Interstellar")).toBeInTheDocument();
    });
  });

  it("displays release dates for results that have one", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText(/2010-07-16/)).toBeInTheDocument();
    });
  });

  it("handles a result with an empty release_date without crashing", async () => {
    (global.fetch as jest.Mock).mockReturnValue(
      buildSuccessResponse([
        { id: 99, title: "No Date Movie", release_date: "", poster_path: null },
      ])
    );
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "no date");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText("No Date Movie")).toBeInTheDocument();
    });
  });

  it("handles a result with null poster_path without crashing", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "interstellar");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText("Interstellar")).toBeInTheDocument();
    });
  });
});


describe("SearchPage – successful TV search", () => {
  it("calls the TV endpoint with the correct query", async () => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse(mockTvResults));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "breaking bad");
    await userEvent.click(screen.getByRole("button", { name: /tv shows/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${TV_ENDPOINT}?title=breaking+bad`),
        expect.anything()
      );
    });
  });

  it("displays returned TV show titles", async () => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse(mockTvResults));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "breaking bad");
    await userEvent.click(screen.getByRole("button", { name: /tv shows/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
    });
  });
});

describe("SearchPage – keyboard submission", () => {
  it("triggers a search when the user presses Enter in the input", async () => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse(mockMovieResults));

    render(<SearchPage />);
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.type(screen.getByRole("textbox"), "inception{enter}");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe("SearchPage – loading state", () => {
  it("shows a loading indicator while the request is in flight", async () => {
    let resolveResponse!: (v: Response) => void;
    const slowResponse = new Promise<Response>((res) => (resolveResponse = res));
    (global.fetch as jest.Mock).mockReturnValue(slowResponse);

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "tenet");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    expect(
      screen.getByRole("status") ||
      screen.getByText(/loading/i) ||
      document.querySelector('[data-testid="loading"]')
    ).toBeTruthy();

   
    resolveResponse(new Response(JSON.stringify({ page: 1, results: [] }), { status: 200 }));
  });

  it("hides the loading indicator once the request completes", async () => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse(mockMovieResults));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});


describe("SearchPage – error handling", () => {
  it("shows an error message when fetch rejects (generic network error)", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch|network|error/i)).toBeInTheDocument();
    });
  });

  it("shows an error message when the server returns a non-OK status", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 })
    );

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText(/error|something went wrong/i)).toBeInTheDocument();
    });
  });
});

describe("SearchPage – CORS bug (known issue)", () => {
  test.failing(
    "KNOWN BUG – fetch rejects with CORS error, component should show a friendly message",
    async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

      render(<SearchPage />);
      await userEvent.type(screen.getByRole("textbox"), "inception");
      await userEvent.click(screen.getByRole("button", { name: /movies/i }));
      await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

      
      await waitFor(() => {
        expect(
          screen.getByText(/cors|network error|unable to connect/i)
        ).toBeInTheDocument();
      });
    }
  );

  it("populates the error state when fetch throws a TypeError (covers CORS path)", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      const errorEl =
        screen.queryByRole("alert") ||
        screen.queryByText(/failed to fetch|network|error/i);
      expect(errorEl).toBeInTheDocument();
    });
  });

  it("clears stale results after a CORS/network failure on a subsequent search", async () => {
    
    (global.fetch as jest.Mock).mockReturnValueOnce(buildSuccessResponse(mockMovieResults));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });

    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "new search");
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Inception")).not.toBeInTheDocument();
    });
  });
});

describe("SearchPage – edge cases", () => {
  it("does not call fetch when no media type has been selected", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "inception");
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not call fetch when the search text is empty", async () => {
    render(<SearchPage />);
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("handles an empty results array without crashing", async () => {
    (global.fetch as jest.Mock).mockReturnValue(buildSuccessResponse([]));

    render(<SearchPage />);
    await userEvent.type(screen.getByRole("textbox"), "xyzzy");
    await userEvent.click(screen.getByRole("button", { name: /movies/i }));
    await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });
});