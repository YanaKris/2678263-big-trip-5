import PointsModel from '../model/points-model.js';
import PointsListPresenter from './points-list-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointsListPresenter = null;

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    const points = this.#pointsModel.getEnrichedPoints();
    const destinations = this.#pointsModel.destinations;
    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => {
        const result = this.#pointsModel.getOfferByType(type);
        console.log('Returns из боард презентера getOfferByType :', result);
        return result;
      },

      getDestinationById: (id) => {
        const result = this.#pointsModel.getDestinationById(id);
        console.log('Returns из боард презентера getDestinationById:', result);
        return result;
      },
      getDescriptionById: (id) => {
        const result = this.#pointsModel.getDescriptionById(id);
        console.log('Returns из боард презентера getDescriptionById:', result);
        return result;
      },

    });
    this.#pointsListPresenter.init(points);
  }

  #handlePointChange = () => {
    // Callback для реакции на изменение точки маршрута
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };
}
