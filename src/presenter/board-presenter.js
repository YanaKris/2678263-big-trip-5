import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointsModel from '../model/points-model.js';

import { render } from '../render.js';

export default class BoardPresenter {
  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
    this.pointsModel = new PointsModel();
    this.pointListComponent = new PointListView();
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);

    const points = this.pointsModel.getPoints();

    const enrichedPoints = points.map((point) => {
      const destinationItem = this.pointsModel.getDestinationById(
        point.destination,
      );

      const destinationName = destinationItem?.name ?? 'Unknown';
      const destinationDescription = destinationItem?.description ?? '';
      const destinationPictures = destinationItem?.pictures ?? [];

      const offerTypeGroup = this.pointsModel.getOfferByType(point.type);
      let resolvedOffers = [];
      if (offerTypeGroup && Array.isArray(offerTypeGroup.offers)) {
        resolvedOffers = point.offers
          .map((offerId) =>
            offerTypeGroup.offers.find((offer) => offer.id === offerId),
          )
          .filter(Boolean);
      }

      return {
        ...point,
        destinationName,
        destinationDescription,
        destinationPictures,
        resolvedOffers,
      };
    });

    if (enrichedPoints.length > 0) {
      render(
        new EditPointView({ point: enrichedPoints[1] }),
        this.pointListComponent.getElement(),
      );
      render(
        new AddNewPointView({ point: enrichedPoints[0] }),
        this.pointListComponent.getElement(),
      );
    }

    enrichedPoints.forEach((enrichedPoint) => {
      render(
        new PointView({ point: enrichedPoint }),
        this.pointListComponent.getElement(),
      );
    });
  }
}
