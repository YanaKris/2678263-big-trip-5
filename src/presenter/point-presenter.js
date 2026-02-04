import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { render, replace } from '../framework/render.js';

export default class PointPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor({pointListContainer}) {
    this.#pointListContainer = pointListContainer;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    render(this.#pointComponent, this.#pointListContainer);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.replaceFormToCard();
    }
  };

  #handleRollupClick = () => {
    this.#replaceFormToCard();
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

}
