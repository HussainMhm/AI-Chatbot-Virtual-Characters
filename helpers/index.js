import { images } from "../data/images";

export const getImage = (id) => {
    const found = images.find(e => e.id === id);
    return found ? found.image : null;
};
