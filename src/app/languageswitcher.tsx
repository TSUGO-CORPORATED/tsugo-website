// import { i18n } from 'next-i18next';
// import { useTranslation } from 'next-i18next';

// // // export default function LanguageSwitcher() {
// // //     const { i18n } = useTranslation();
  
// // //     const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
// // //         if (i18n) {
// // //           i18n.changeLanguage(event.target.value);
// // //         }
// // //       };
  
// // //     return (
// // //         <div>
// // //         <select className='languageswitcher_selectbar' onChange={changeLanguage} defaultValue={i18n.language}>
// // //           <option value="en">English</option>
// // //           <option value="ja">日本語</option>
// // //         </select>
// // //       </div>
// // //     );
// // //   };
// export default function LanguageSwitcher() {
//     const { i18n } = useTranslation();
  
//     const changeLanguage = (language: string) => {
//       if (i18n) {
//         i18n.changeLanguage(language);
//       }
//     };
  
//     return (
//       <div>
//         <button onClick={() => changeLanguage('en')}>English</button>
//         <button onClick={() => changeLanguage('ja')}>日本語</button>
//       </div>
//     );
//   };
