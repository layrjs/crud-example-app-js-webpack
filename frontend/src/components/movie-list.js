import {Component, attribute, consume} from '@layr/component';
import {Routable, route} from '@layr/routable';
import React from 'react';
import {view, useAsyncMemo} from '@layr/react-integration';

export class MovieList extends Routable(Component) {
  @consume() static Movie;
  @consume() static Common;

  @attribute('Movie[]?') items;

  @view() static Layout({children}) {
    return (
      <div>
        <h2>Movies</h2>
        {children}
      </div>
    );
  }

  @route('/movies', {aliases: ['/']}) @view() static Main() {
    const [movieList, isLoading, loadingError, retryLoading] = useAsyncMemo(async () => {
      const movieList = new this();

      movieList.items = await this.Movie.find(
        {},
        {title: true, year: true},
        {sort: {year: 'desc', title: 'asc'}}
      );

      return movieList;
    }, []);

    if (isLoading) {
      return <this.Common.LoadingMessage />;
    }

    if (loadingError) {
      return (
        <this.Common.ErrorMessage
          message="Sorry, something went wrong while loading the movies."
          onRetry={retryLoading}
        />
      );
    }

    return (
      <this.Layout>
        <movieList.Main />
      </this.Layout>
    );
  }

  @view() Main() {
    const {Movie} = this.constructor;

    return (
      <>
        <ul>
          {this.items.map((movie) => (
            <movie.ListItem key={movie.id} />
          ))}
        </ul>
        <p>
          <button onClick={() => Movie.Creator.navigate()}>New</button>
        </p>
      </>
    );
  }
}
