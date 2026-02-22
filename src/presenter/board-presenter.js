import PointsModel from '../model/points-model.js';
import PointsListPresenter from './points-list-presenter.js';
import { UpdateType, UserAction } from '../constants.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointsListPresenter = null;

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.getEnrichedPoints();
    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
      getDestinationById: (id) => this.#pointsModel.getDestinationById(id),
      getDescriptionById: (id) => this.#pointsModel.getDescriptionById(id),
      handleViewAction: this.#handleViewAction.bind(this),
    });
    this.#pointsListPresenter.init(points);
  }

  get points() {
    return this.#pointsModel.points;
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointsListPresenter.updatePoint(updatedPoint);
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };

  #clearBoard() {
    if (this.#pointsListPresenter) {
      this.#pointsListPresenter.destroy();
      this.#pointsListPresenter = null;
    }
  }

  #renderBoard() {
    const enrichedPoints = this.#pointsModel.getEnrichedPoints(); // Получаем обогащённые данные
    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
      getDestinationById: (id) => this.#pointsModel.getDestinationById(id),
      getDescriptionById: (id) => this.#pointsModel.getDescriptionById(id),
      handleViewAction: this.#handleViewAction.bind(this),
    });
    this.#pointsListPresenter.init(enrichedPoints); // Инициализируем презентер с данными
  }

  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // console.log('PATCH', data);
        this.#pointsListPresenter.updatePointById(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

}
