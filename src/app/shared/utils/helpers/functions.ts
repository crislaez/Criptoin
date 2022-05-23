import { IonContent } from "@ionic/angular";
import { SwiperOptions } from "swiper";

export const trackById = (_: number, item: any): number => {
  return item.id;
}

export const errorImage = (event): void => {
  event.target.src = '../../../../assets/images/image_not_found.png';
}

export const emptyObject = (object: any): boolean => {
  return Object.keys(object || {})?.length > 0 ? true : false
}

export const getObjectKeys = (obj: any): any => {
  return Object.keys(obj || {})
}

export const gotToTop = (content: IonContent): void => {
  content?.scrollToTop(500);
}

export const sliceSmallText = (text: string) => {
  return text?.length > 5 ? text?.slice(0, 5) + '...' : text;
}

export const sliceText = (text: string) => {
  return text?.length > 17 ? text?.slice(0, 17) + '...' : text;
}

export const sliceLongText = (text: string) => {
  return text?.length > 25 ? text?.slice(0, 25) + '...' : text;
}

export const dateFormat = (timeStamp: number) =>  {
  const data = new Date(timeStamp);
  const dayFunction = data?.getDate();

  const day = dayFunction?.toString()?.split('')?.length > 1 ? dayFunction : `0${dayFunction}`;
  const monthFunction = data?.getMonth() + 1
  const month = monthFunction?.toString()?.split('')?.length > 1 ? monthFunction : `0${monthFunction}`;

  return `${day}/${month}/${data?.getFullYear()}`;
}

export const getSliderConfig = (info:any): SwiperOptions => {
  return {
    slidesPerView: info?.length > 1 ? 2 : 1,
    spaceBetween: 40,
    // freeMode: true,
    pagination:{ clickable: true },
    lazy: true,
    preloadImages: false
  };
}

export const chartOptions = () => {
  return {
    lineHeightAnnotation:{
      always: true,
      hover: false,
      lineWeight: 1.5
    },
    animation:{
      diration: 2000
    },
    scales:{
      xAxes:[
        {
          type: 'time',
          distribution: 'linear'
        }
      ],
    }
  }
}
