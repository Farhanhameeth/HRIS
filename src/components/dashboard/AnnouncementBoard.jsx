import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isSameDay } from "date-fns";
import Modal from "react-modal";
import { fetchAnnouncements, selectAnnouncements } from "../../features/announcement/announcementSlice";
import TileHeader from "../reusable/TileHeader";

Modal.setAppElement('#root');

const AnnouncementBoard = ({ targetDepartmentId }) => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAnnouncements);
    const status = useSelector(state => state.announcement.status);
    const error = useSelector(state => state.announcement.error);

    const [selectedDate, setSelectedDate] = useState(null);
    const [visibleCount, setVisibleCount] = useState(2);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    const sortedAnnouncements = [...announcements].sort(
        (a, b) => new Date(b.announcementDate || 0) - new Date(a.announcementDate || 0)
    );

    const filteredAnnouncements = selectedDate
        ? sortedAnnouncements.filter(a => a.announcementDate && isSameDay(new Date(a.announcementDate), new Date(selectedDate)))
        : sortedAnnouncements;

    const displayedAnnouncements = filteredAnnouncements.slice(0, visibleCount);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <div className="bg-white shadow-customShadow rounded-lg">
                <TileHeader 
                    HeaderText="Announcements" 
                    showDatePicker={true} 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                />
                {displayedAnnouncements.length === 0 ? (
                    <p className="text-gray-600">No announcements for the selected date.</p>
                ) : (
                    <ul className="p-3 space-y-2">
                        {displayedAnnouncements.map((announcement, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                                <h3 className="text-base font-semibold text-gray-900">{announcement.title}</h3>
                                <p className="text-sm text-gray-500">{announcement.description}</p>
                                <p className="text-xs text-gray-400">
                                    {announcement.announcementDate 
                                        ? new Date(announcement.announcementDate).toLocaleDateString() 
                                        : "No Date Available"}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-2 p-2 flex justify-between">
                    <button
                        onClick={openModal}
                        className="w-1/2 p-2 bg-customOrange-100 text-black rounded-md hover:bg-customOrange-200 transition-colors duration-200"
                    >
                        View More
                    </button>
                    <button
                        onClick={() => setSelectedDate(null)}
                        className="w-1/2 ml-2 p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                        Clear Filter
                    </button>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="More Announcements"
                className="modal p-6 bg-white rounded-lg shadow-lg"
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <div className="relative">
                    <button onClick={closeModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <h2 className="text-lg font-bold mb-4">More Announcements</h2>
                    <ul>
                        {filteredAnnouncements.map((announcement, index) => (
                            <li key={index} className="mb-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                                <h3 className="text-base font-semibold text-gray-900">{announcement.title}</h3>
                                <p className="text-sm text-gray-500">{announcement.description}</p>
                                <p className="text-xs text-gray-400">
                                    {announcement.announcementDate 
                                        ? new Date(announcement.announcementDate).toLocaleDateString() 
                                        : "No Date Available"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </>
    );
};

export default AnnouncementBoard;
