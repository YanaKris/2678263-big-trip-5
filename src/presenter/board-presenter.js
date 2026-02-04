import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointsModel from '../model/points-model.js';
import PointPresenter from './point-presenter.js';

import { render, RenderPosition } from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();
  #sortComponent = new SortView();

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.#boardContainer);
    render(this.#pointListComponent, this.#boardContainer);

    const enrichedPoints = this.#pointsModel.getEnrichedPoints();
    enrichedPoints.forEach((enrichedPoint) => {
      this.#renderPoint(enrichedPoint);
    });
  }

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(enrichedPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
    });
    pointPresenter.init(enrichedPoint);
  }
}
