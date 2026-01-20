import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import service from '../Appwrite/config';
import authService from '../Appwrite/auth';
import conf from '../conf/Conf';

function UserProfileGeneral() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [hasChanged, setHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const onSubmit = useCallback(async (data) => {
        setLoading(true);
        try {
            const userData = await authService.getCurrentUser();
            if (userData) {
                const weightAdd = await service.addWeight(data.weight, userData.$id)
                if (weightAdd) {
                    console.log("weight", weightAdd)
                }
                else {
                    console.log("failed to add weight progress!")
                }
            }

            if (isEdit) {
                const dbUpdateProfileInfo = await service.updateUserProfile(userData.$id, { ...data });
                if (dbUpdateProfileInfo) {
                    toast.success("Profile updated successfully!");
                } else {
                    toast.error("Failed to update profile.");
                }
            } else {
                const dbUserProfileInfo = await service.createUserProfile({ ...data, docId: userData.$id });
                if (dbUserProfileInfo) {
                    toast.success("Profile created successfully!");
                    setIsEdit(true);
                } else {
                    toast.error("Failed to create profile.");
                }
            }
            setHasChanged(false);
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("Error submitting the form.");
        } finally {
            setLoading(false);
        }
    }, [isEdit]);

    const fetchUserProfile = useCallback(async () => {
        setFetching(true);
        try {
            const userData = await authService.getCurrentUser();
            const existingProfile = await service.getUserInformation(conf.appwriteUserInfoCollectionId, userData.$id);
            if (existingProfile) {
                setIsEdit(true);
                setValue("name", existingProfile.name);
                setValue("age", existingProfile.age);
                setValue("weight", existingProfile.weight);
                setValue("hight", existingProfile.hight);
                setValue("fitnessGoals", existingProfile.fitnessGoals);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Error fetching user profile.");
        } finally {
            setFetching(false);
        }
    }, [setValue]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return (
        <div className="animate-fade-in">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                transition={Slide}
            />

            {fetching ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name:</label>
                        <input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            onChange={() => setHasChanged(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age:</label>
                            <input
                                type="number"
                                id="age"
                                {...register("age", {
                                    required: "Age is required",
                                    min: { value: 1, message: "Age must be positive" },
                                    valueAsNumber: true
                                })}
                                onChange={() => setHasChanged(true)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight KG:</label>
                            <input
                                type="number"
                                id="weight"
                                {...register("weight", {
                                    required: "Weight is required",
                                    min: { value: 1, message: "Weight must be positive" },
                                    valueAsNumber: true
                                })}
                                onChange={() => setHasChanged(true)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="hight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height Inches:</label>
                        <input
                            type="number"
                            id="hight"
                            step="0.1"
                            {...register("hight", {
                                required: "Height is required",
                                min: { value: 1, message: "Height must be positive" },
                                valueAsNumber: true
                            })}
                            onChange={() => setHasChanged(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.hight && <p className="mt-1 text-sm text-red-500">{errors.hight.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="fitnessGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Goal:</label>
                        <input
                            id="fitnessGoals"
                            {...register("fitnessGoals", { required: "Fitness goal is required" })}
                            onChange={() => setHasChanged(true)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. weight Gain"
                        />
                        {errors.fitnessGoals && <p className="mt-1 text-sm text-red-500">{errors.fitnessGoals.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-emerald-600'} text-white rounded-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : hasChanged ? (isEdit ? "Update" : "Save") : "Save"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UserProfileGeneral;
