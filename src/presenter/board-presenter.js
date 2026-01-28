import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointsModel from '../model/points-model.js';

import {render} from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.#boardContainer);
    render(this.#pointListComponent, this.#boardContainer);

    const enrichedPoints = this.#pointsModel.getEnrichedPoints();

    if (enrichedPoints.length > 0) {
      render(
        new EditPointView({ point: enrichedPoints[1] }),
        this.#pointListComponent.element
      );
      render(
        new AddNewPointView({ point: enrichedPoints[0] }),
        this.#pointListComponent.element,
      );
    }

    // можно вынести рендер точек в отдельную функцию
    enrichedPoints.forEach((enrichedPoint) => {
      render(
        new PointView({ point: enrichedPoint }),
        this.#pointListComponent.element,
      );
    });
  }
}
