import {ArrowLeft} from "lucide-react";
import React from "react";

const UserDetailSkeleton = () => {
  return (
    <div className="min-h-screen overflow-hidden rounded-2xl pt-6 text-white">
      <div className="flex ml-6 items-center space-x-2">
        <button
          onClick={() => window.history.back()}
          className="bg-dark-10 rounded-2xl px-6 py-3 flex items-center text-dark-35 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={20}
            className="mr-2"
          />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-dark-15"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-dark-15 rounded"></div>
                  <div className="h-3 w-20 bg-dark-15 rounded"></div>
                  <div className="h-3 w-28 bg-dark-15 rounded"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 w-40 bg-dark-15 rounded"></div>
                <div className="h-20 w-full bg-dark-15 rounded"></div>
              </div>

              <div className="mt-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full bg-dark-15 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-dark-15 rounded"></div>
                <div className="h-4 w-10 bg-dark-15 rounded"></div>
              </div>

              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-dark-15 rounded"
                  ></div>
                ))}
              </div>

              <div className="h-8 w-full bg-dark-15 rounded mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default UserDetailSkeleton;