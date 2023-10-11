import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { Post } from "../utils/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { categoryNameToColor } from "../utils/categoriesColors";

type DateItem = {
  day: number;
  month: number;
  year: number;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getMonthName = (monthNumber: number) => monthNames[monthNumber - 1];

const getCurrentDate = () => {
  const date = new Date();
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};

const isCurrentMonthAndYear = (month: number, year: number) => {
  const currentDate = new Date();
  return (
    month === currentDate.getMonth() + 1 && year === currentDate.getFullYear()
  );
};

const PostCalendar: React.FC = () => {
  const [postDates, setPostDates] = useState<DateItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDatePosts, setSelectedDatePosts] = useState<Post[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentDate().month);
  const [currentYear, setCurrentYear] = useState(getCurrentDate().year);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPostDates = async (month: number, year: number) => {
      try {
        const postsCollection = collection(db, "posts");
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        const q = query(
          postsCollection,
          where("publishedAt", ">=", startOfMonth),
          where("publishedAt", "<=", endOfMonth)
        );

        const querySnapshot = await getDocs(q);
        const dates = querySnapshot.docs.map((doc) => {
          const postData = doc.data() as Post;
          const postDate = postData.publishedAt.toDate();
          return {
            day: postDate.getDate(),
            month: postDate.getMonth() + 1,
            year: postDate.getFullYear(),
          };
        });

        setPostDates(dates);
      } catch (e) {
        console.error("Error fetching post dates:", e);
      }
    };
    fetchPostDates(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      setIsModalVisible(false);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // This function checks if a day has any posts
  const hasPosts = (date: DateItem): boolean => {
    return postDates.some(
      (postDate) =>
        postDate.day === date.day &&
        postDate.month === date.month &&
        postDate.year === date.year
    );
  };

  // This function checks if a day is today
  const isToday = (date: DateItem): boolean => {
    const today = new Date();
    return (
      date.day === today.getDate() &&
      date.month === today.getMonth() + 1 &&
      date.year === today.getFullYear()
    );
  };

  // This function checks if a day is in the future
  const isInFuture = (date: DateItem): boolean => {
    const today = new Date();
    const inputDate = new Date(date.year, date.month - 1, date.day);
    return inputDate > today;
  };

  // This function formats a date to a string like "12:00 PM"
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // This function displays the number of posts for the selected date
  const displaySelectedDateInfo = () => {
    if (!selectedDatePosts.length) return null;

    const date = selectedDatePosts[0].publishedAt.toDate();
    const day = date.getDate();
    const month = getMonthName(date.getMonth() + 1);
    const year = date.getFullYear();

    return (
      <h3>
        Showing {selectedDatePosts.length} post
        {selectedDatePosts.length > 1 ? "s" : ""} from day {day} of {month}{" "}
        {year}
      </h3>
    );
  };

  const handleDayClick = async (date: DateItem) => {
    try {
      const postsForDate = await fetchPostsForDate(date);
      setSelectedDatePosts(postsForDate);
      setIsModalVisible(true);
    } catch (e) {
      console.error("Error fetching posts for selected date:", e);
    }
  };

  const fetchPostsForDate = async (date: DateItem): Promise<Post[]> => {
    const postsCollection = collection(db, "posts");
    const startOfDay = new Date(date.year, date.month - 1, date.day);
    const endOfDay = new Date(date.year, date.month - 1, date.day, 23, 59, 59);
    const q = query(
      postsCollection,
      where("publishedAt", ">=", startOfDay),
      where("publishedAt", "<=", endOfDay)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Post)
    );
  };

  const renderDayNames = () => {
    return (
      <div className="day-names">
        {dayNames.map((name, index) => (
          <span key={index} className="day-name">
            {name}
          </span>
        ))}
      </div>
    );
  };

  const renderMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const offset = (firstDayOfMonth - 1 + 7) % 7;

    const lastDayOfMonth = new Date(year, month, 0).getDay();
    const paddingAfter = (7 - lastDayOfMonth) % 7;

    const days = [];

    for (let i = 0; i < offset; i++) {
      days.push(<span key={`pad-${i}`} className="padding-day"></span>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = { day, month, year };
      const dayClass = isToday(currentDate)
        ? "today"
        : isInFuture(currentDate)
        ? "future"
        : "";

      if (hasPosts(currentDate)) {
        days.push(
          <span
            key={day}
            className={`day ${dayClass}`}
            onClick={() => handleDayClick(currentDate)}
          >
            {day}
          </span>
        );
      } else {
        days.push(
          <span key={day} className={dayClass}>
            {day}
          </span>
        );
      }
    }

    for (let i = 0; i < paddingAfter; i++) {
      days.push(<span key={`pad-after-${i}`} className="padding-day"></span>);
    }

    return (
      <div className="month">
        <div className="month-header">
          <button
            className="month-nav"
            onClick={goToPreviousMonth}
          >
            Prev
          </button>
          <p className="total">
            {postDates.length > 0
              ? `Found ${postDates.length} Posts`
              : "No Posts"}
          </p>
          <button
            className="month-nav"
            onClick={goToNextMonth}
            disabled={isCurrentMonthAndYear(currentMonth, currentYear)}
          >
            Next
          </button>
        </div>
        {renderDayNames()}
        <div className="days-container">{days}</div>
      </div>
    );
  };

  return (
    <div className="post-calendar">
      <h2>
        <span className="material-symbols-outlined">calendar_month</span>
        {getMonthName(currentMonth)} {currentYear}
      </h2>
      {renderMonth(currentMonth, currentYear)}
      {isModalVisible && (
        <div
          className="modal-posts-background animate__animated animate__fadeIn"
          onClick={handleOutsideClick}
        >
          <div
            ref={modalContentRef}
            className="modal-content animate__animated animate__bounceInUp"
          >
            <h3>{displaySelectedDateInfo()}</h3>
            {selectedDatePosts.map((post) => (
              <div key={post.id} className="post-info">
                <Link
                  to={`/post/${post.id}`}
                  className="post-title"
                  style={{ color: categoryNameToColor(post.category!) }}
                >
                  {post.title}
                </Link>
                <p className="post-description"></p>
                <p className="post-date">
                  <span className="material-symbols-outlined">
                    pending_actions
                  </span>
                  {formatTime(new Date(post.publishedAt.toDate()))} in{" "}
                  <Link
                    to={`/category/${post.category}`}
                    className="category"
                    onClick={() => setIsModalVisible(false)}
                    style={{ color: categoryNameToColor(post.category!) }}
                  >
                    {post.category}
                  </Link>
                </p>
              </div>
            ))}
            <button
              className="btn yellow"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCalendar;
