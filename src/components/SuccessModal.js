import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiCheck, HiTrophy, HiFire } from 'react-icons/hi2';

export default function SuccessModal({ isOpen, onClose, title, message, type, streakCount }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`
                                        w-16 h-16 rounded-full flex items-center justify-center mb-4
                                        ${type === 'habit-created' ? 'bg-green-100' : ''}
                                        ${type === 'habit-completed' ? 'bg-blue-100' : ''}
                                        ${type === 'streak' ? 'bg-orange-100' : ''}
                                    `}>
                                        {type === 'habit-created' && (
                                            <HiCheck className="w-8 h-8 text-green-600" />
                                        )}
                                        {type === 'habit-completed' && (
                                            <HiTrophy className="w-8 h-8 text-blue-600" />
                                        )}
                                        {type === 'streak' && (
                                            <HiFire className="w-8 h-8 text-orange-600" />
                                        )}
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-semibold leading-6 text-gray-900 mb-2"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <p className="text-gray-600">
                                            {message}
                                        </p>
                                    </div>

                                    {type === 'streak' && streakCount && (
                                        <div className="mt-4 bg-orange-50 px-4 py-3 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-600 mb-1">
                                                {streakCount} Days
                                            </div>
                                            <div className="text-sm text-orange-700">
                                                Current Streak
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className={`
                                                px-4 py-2 text-sm font-medium text-white rounded-lg
                                                ${type === 'habit-created' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                ${type === 'habit-completed' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                                ${type === 'streak' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                            `}
                                            onClick={onClose}
                                        >
                                            {type === 'streak' ? 'Keep it up!' : 'Awesome!'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}