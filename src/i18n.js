import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Cookies from 'js-cookie';

//import Backend from 'i18next-http-backend';
//import LanguageDetector from 'i18next-browser-languagedetector';

import en_TopNavBar from './locale/en/components/TopNavBar.json';
import en_UserSettings from './locale/en/components/UserSettings.json';
import en_Login from './locale/en/components/Login.json';
import en_Registration from './locale/en/components/Registration.json';
import en_SearchBar from './locale/en/components/SearchBar.json';
import en_PopoverFilterReviews from './locale/en/components/PopoverFilterReviews.json';
import en_OtherAuthorReviews from './locale/en/components/OtherAuthorReviews.json';
import en_ReviewFull from './locale/en/components/ReviewFull.json';
import en_ReviewLists from './locale/en/components/ReviewLists.json';
import en_ReviewItem from './locale/en/components/ReviewItem.json';
import en_ReviewComments from './locale/en/components/ReviewComments.json';
import en_ReviewCommentRemove from './locale/en/components/ReviewCommentRemove.json';
import en_ReviewCommentEdit from './locale/en/components/ReviewCommentEdit.json';
import en_ReviewCommentAutoUpdate from './locale/en/components/ReviewCommentAutoUpdate.json';
import en_ReviewCommentItem from './locale/en/components/ReviewCommentItem.json';
import en_ReviewLike from './locale/en/components/ReviewLike.json';
import en_MyReviewLists from './locale/en/components/MyReviewLists.json';
import en_MyReviewRow from './locale/en/components/MyReviewRow.json';
import en_ModalNewTitle from './locale/en/components/ModalNewTitle.json';
import en_MyReviewFullForm from './locale/en/components/MyReviewFullForm.json';
import en_ImageLists from './locale/en/image/ImageLists.json';
import en_ImageUpload from './locale/en/image/ImageUpload.json';
import en_ModalImages from './locale/en/image/ModalImages.json';

import ru_TopNavBar from './locale/ru/components/TopNavBar.json';
import ru_UserSettings from './locale/ru/components/UserSettings.json';
import ru_Login from './locale/ru/components/Login.json';
import ru_Registration from './locale/ru/components/Registration.json';
import ru_SearchBar from './locale/ru/components/SearchBar.json';
import ru_PopoverFilterReviews from './locale/ru/components/PopoverFilterReviews.json';
import ru_OtherAuthorReviews from './locale/ru/components/OtherAuthorReviews.json';
import ru_ReviewFull from './locale/ru/components/ReviewFull.json';
import ru_ReviewLists from './locale/ru/components/ReviewLists.json';
import ru_ReviewItem from './locale/ru/components/ReviewItem.json';
import ru_ReviewComments from './locale/ru/components/ReviewComments.json';
import ru_ReviewCommentRemove from './locale/ru/components/ReviewCommentRemove.json';
import ru_ReviewCommentEdit from './locale/ru/components/ReviewCommentEdit.json';
import ru_ReviewCommentAutoUpdate from './locale/ru/components/ReviewCommentAutoUpdate.json';
import ru_ReviewCommentItem from './locale/ru/components/ReviewCommentItem.json';
import ru_ReviewLike from './locale/ru/components/ReviewLike.json';
import ru_MyReviewLists from './locale/ru/components/MyReviewLists.json';
import ru_MyReviewRow from './locale/ru/components/MyReviewRow.json';
import ru_ModalNewTitle from './locale/ru/components/ModalNewTitle.json';
import ru_MyReviewFullForm from './locale/ru/components/MyReviewFullForm.json';
import ru_ImageLists from './locale/ru/image/ImageLists.json';
import ru_ImageUpload from './locale/ru/image/ImageUpload.json';
import ru_ModalImages from './locale/ru/image/ModalImages.json';

// ReviewItem

i18n
	//.use(Backend)
	//.use()
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				"components/TopNavBar": en_TopNavBar,
				"components/UserSettings": en_UserSettings,
				"components/Login": en_Login,
				"components/Registration": en_Registration,
				"components/SearchBar": en_SearchBar,
				"components/PopoverFilterReviews": en_PopoverFilterReviews,
				"components/OtherAuthorReviews": en_OtherAuthorReviews,
				"components/ReviewFull": en_ReviewFull,
				"components/ReviewLists": en_ReviewLists,
				"components/ReviewItem": en_ReviewItem,
				"components/ReviewComments": en_ReviewComments,
				"components/ReviewCommentRemove": en_ReviewCommentRemove,
				"components/ReviewCommentEdit": en_ReviewCommentEdit,
				"components/ReviewCommentAutoUpdate": en_ReviewCommentAutoUpdate,
				"components/ReviewCommentItem": en_ReviewCommentItem,
				"components/ReviewLike": en_ReviewLike,
				"components/MyReviewLists": en_MyReviewLists,
				"components/MyReviewRow": en_MyReviewRow,
				"components/ModalNewTitle": en_ModalNewTitle,
				"components/MyReviewFullForm": en_MyReviewFullForm,
				"image/ImageLists": en_ImageLists,
				"image/ImageUpload": en_ImageUpload,
				"image/ModalImages": en_ModalImages,
			},
			ru: {
				"components/TopNavBar": ru_TopNavBar,
				"components/UserSettings": ru_UserSettings,
				"components/Login": ru_Login,
				"components/Registration": ru_Registration,
				"components/SearchBar": ru_SearchBar,
				"components/PopoverFilterReviews": ru_PopoverFilterReviews,
				"components/OtherAuthorReviews": ru_OtherAuthorReviews,
				"components/ReviewFull": ru_ReviewFull,
				"components/ReviewLists": ru_ReviewLists,
				"components/ReviewItem": ru_ReviewItem,
				"components/ReviewComments": ru_ReviewComments,
				"components/ReviewCommentRemove": ru_ReviewCommentRemove,
				"components/ReviewCommentEdit": ru_ReviewCommentEdit,
				"components/ReviewCommentAutoUpdate": ru_ReviewCommentAutoUpdate,
				"components/ReviewCommentItem": ru_ReviewCommentItem,
				"components/ReviewLike": ru_ReviewLike,
				"components/MyReviewLists": ru_MyReviewLists,
				"components/MyReviewRow": ru_MyReviewRow,
				"components/ModalNewTitle": ru_ModalNewTitle,
				"components/MyReviewFullForm": ru_MyReviewFullForm,
				"image/ImageLists": ru_ImageLists,
				"image/ImageUpload": ru_ImageUpload,
				"image/ModalImages": ru_ModalImages,
			}
		},
		lng: Cookies.get('Lang'),
		fallbackLng: 'en',
		//debug: true,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		}
	});

export default i18n;
