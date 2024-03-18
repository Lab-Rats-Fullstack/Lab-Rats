import { useEffect, useState } from "react";

export default function Pagination ({
        Card,
        cardArr,
        currentCards,
        setCurrentCards, 
        cardType,
        numberPerPage,
        currentUser
      }) {
        const [numberOfPages, setNumberofPages] = useState(0);
        const [currentPage, setCurrentPage] = useState(1);
      
        function determineNumberOfPages(arr) {
          return Math.ceil(arr.length / numberPerPage);
        }
      
        function splitCardsIntoPages() {
          const pages = determineNumberOfPages(cardArr);
          setNumberofPages(pages);
        }
      
        function sliceCards(arr) {
          const start = (currentPage - 1) * numberPerPage;
          const end = start + numberPerPage;
      
          const currentPageCards = arr.slice(start, end);
          setCurrentCards(currentPageCards);
        }
      
        function CreatePageButtons() {
          const arr = new Array(numberOfPages).fill(0);
          return (
            <div className="pageButtons">
              {arr.length > 1 ? (
                arr.map((item, idx) => {
                  return (
                    <button onClick={() => setCurrentPage(idx + 1)} key={idx}>
                      {idx + 1}
                    </button>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          );
        }
      
        useEffect(() => {
          splitCardsIntoPages();
        }, [numberOfPages, currentPage, cardArr]);
        useEffect(() => sliceCards(cardArr), [currentPage, cardArr]);
      
        return (
          <>
            {currentCards == "" ? (
              <p className="noContent">{`There are currently no ${cardType}s.`}</p>
            ) : (
              currentCards.map((card) => {
                const obj = {}
                obj[cardType] = {...card}
                console.log(obj)
                return (
                  <Card
                    key={card.id}
                    {...obj}
                    currentUser={currentUser}
                  />
                );
              })
            )}
            <CreatePageButtons />
          </>
        );
      }
      
