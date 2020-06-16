import {consume} from '@liaison/component';
import {Routable, route} from '@liaison/routable';
import React, {useMemo} from 'react';
import {view, useAsyncMemo, useAsyncCallback} from '@liaison/react-integration';

export function Movie(Base) {
  class Movie extends Routable(Base) {
    @consume() static MovieList;
    @consume() static Common;

    @view() static Layout({children}) {
      return (
        <div>
          <h2>Movie</h2>
          {children}
        </div>
      );
    }

    @view() static Loader({id, children}) {
      const [movie, isLoading, loadingError, retryLoading] = useAsyncMemo(async () => {
        return await this.get(id, {title: true, year: true, country: true});
      }, [id]);

      if (isLoading) {
        return <this.Common.LoadingMessage />;
      }

      if (loadingError) {
        return (
          <this.Common.ErrorMessage
            message="Sorry, something went wrong while loading the movie."
            onRetry={retryLoading}
          />
        );
      }

      return children(movie);
    }

    @route('/movies/:id') @view() static Main({id}) {
      return (
        <this.Layout>
          <this.Loader id={id}>{(movie) => <movie.Main />}</this.Loader>
          <p>
            ‹ <this.MovieList.Main.Link>Back</this.MovieList.Main.Link>
          </p>
        </this.Layout>
      );
    }

    @view() Main() {
      const {MovieList, Editor} = this.constructor;

      const [handleDelete, isDeleting, deletingError] = useAsyncCallback(async () => {
        await this.delete();

        MovieList.Main.navigate();
      }, []);

      return (
        <div>
          {deletingError && <p>Sorry, something went wrong while deleting the movie.</p>}
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>{this.title}</td>
              </tr>
              <tr>
                <td>Year:</td>
                <td>{this.year}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.country}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <button onClick={() => Editor.navigate(this)} disabled={isDeleting}>
              Edit
            </button>
            &nbsp;
            <button onClick={handleDelete} disabled={isDeleting}>
              Delete
            </button>
          </p>
        </div>
      );
    }

    @route('/movies/-/create') @view() static Creator() {
      const movie = useMemo(() => {
        return new this();
      }, []);

      return (
        <this.Layout>
          <movie.Creator />
        </this.Layout>
      );
    }

    @view() Creator() {
      const {MovieList} = this.constructor;

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await this.save();

        MovieList.Main.navigate();
      }, []);

      return (
        <div>
          {savingError && <p>Sorry, something went wrong while saving the movie.</p>}
          <this.Form onSubmit={handleSave} />
          <p>
            ‹ <MovieList.Main.Link>Back</MovieList.Main.Link>
          </p>
        </div>
      );
    }

    @route('/movies/:id/edit') @view() static Editor({id}) {
      return (
        <this.Layout>
          <this.Loader id={id}>{(movie) => <movie.Editor />}</this.Loader>
        </this.Layout>
      );
    }

    @view() Editor() {
      const {Main} = this.constructor;

      const forkedMovie = useMemo(() => this.fork(), []);

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await forkedMovie.save();

        this.merge(forkedMovie);

        Main.navigate(this);
      }, [forkedMovie]);

      return (
        <div>
          {savingError && <p>Sorry, something went wrong while saving the movie.</p>}
          <forkedMovie.Form onSubmit={handleSave} />
          <p>
            ‹ <Main.Link params={this}>Back</Main.Link>
          </p>
        </div>
      );
    }

    @view() Form({onSubmit}) {
      const [handleSubmit, isSubmitting] = useAsyncCallback(
        async (event) => {
          event.preventDefault();
          await onSubmit();
        },
        [onSubmit]
      );

      return (
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  <input
                    value={this.title}
                    onChange={(event) => {
                      this.title = event.target.value;
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Year:</td>
                <td>
                  <input
                    value={this.year !== undefined ? String(this.year) : ''}
                    onChange={(event) => {
                      this.year = Number(event.target.value) || undefined;
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>
                  <input
                    value={this.country}
                    onChange={(event) => {
                      this.country = event.target.value;
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </p>
        </form>
      );
    }

    @view() ListItem() {
      const {Main} = this.constructor;

      return (
        <li>
          <Main.Link params={this}>{this.title}</Main.Link>
          {this.year !== undefined ? ` (${this.year})` : ''}
        </li>
      );
    }
  }

  return Movie;
}
