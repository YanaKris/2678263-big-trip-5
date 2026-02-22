import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
// import { updateItem } from '../utils/utils.js';
import { SORT_FUNCTIONS } from '../utils/sort.js';
import { SortType } from '../constants.js';

import { render, remove, RenderPosition } from '../framework/render.js';

export default class PointsListPresenter {
  #listContainer = null;
  #destinations = [];
  #points = [];
  #sourcedPoints = [];
  #currentSortType = SortType.DAY;

  #pointListComponent = new PointListView();
  #sortComponent = null;
  #pointPresenters = new Map();

  #onPointChange = null;
  #onModeChange = null;
  #getOffersByType = null;
  #getDestinationById = null;
  #getDescriptionById = null;

  constructor({
    listContainer,
    destinations,
    onPointChange,
    onModeChange,
    getOffersByType,
    getDestinationById,
    getDescriptionById,
    handleViewAction,
  }) {
    this.#listContainer = listContainer;
    this.#destinations = destinations;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
    this.#getOffersByType = getOffersByType;
    this.#getDestinationById = getDestinationById;
    this.#getDescriptionById = getDescriptionById;
    this.#handleViewAction = handleViewAction;
  }

  init(points) {
    this.#points = points;
    this.#sourcedPoints = [...points];

    this.#points.sort(SORT_FUNCTIONS[SortType.DAY]);
    this.#renderSort();
    render(this.#pointListComponent, this.#listContainer);
    this.#renderPoints();
  }

  // #handlePointChange = (updatedPoint) => {
  //   this.#points = updateItem(this.#points, updatedPoint);
  //   this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  //   this.#onPointChange(updatedPoint);
  // };
  //раньше было так, меняли в презентере, теперь тянем из модели
  //возможно метод вернется

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#onModeChange();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#points.sort(SORT_FUNCTIONS[sortType]);
    this.#clearPointList();
    this.#renderPoints();
  };

  updatePointById(updatedPoint) {
    this.#pointPresenters.get(updatedPoint.id);
    // const existingPresenter = this.#pointPresenters.get(updatedPoint.id);
    // if (!existingPresenter) {

    // }
    // console.log('updatePointById', updatedPoint.id);

  }

  clearAndReRenderPoints() {
    this.#clearPointList();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      destinations: this.#destinations,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
      getOffersByType: (type) => this.#getOffersByType(type),
      getDestinationById: (id) => this.#getDestinationById(id),
      getDescriptionById: (id) => this.#getDescriptionById(id),
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
  }

  destroy() {
    this.#clearPointList();
    remove(this.#sortComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    this.#handleViewAction(actionType, updateType, update);
  };

}
