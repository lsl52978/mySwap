"use client";

import React, { useState } from "react";
import Button from "@/components/Button"; // 按钮组件
import Modal from "@/components/Modal"; // 模态框组件

const LiquidityPage = () => {
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manage Liquidity
        </h1>

        {/* Add & Remove Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => setIsAddLiquidityOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Add Liquidity
          </Button>
          <Button
            onClick={() => setIsRemoveLiquidityOpen(true)}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Remove Liquidity
          </Button>
        </div>

        {/* Add Liquidity Modal */}
        <Modal
          isOpen={isAddLiquidityOpen}
          onClose={() => setIsAddLiquidityOpen(false)}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Add Liquidity
          </h2>
          <form>
            <label className="block text-sm font-medium text-gray-600">
              Token Amount
            </label>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter amount"
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setIsAddLiquidityOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button className="bg-green-500 hover:bg-green-600">
                Confirm
              </Button>
            </div>
          </form>
        </Modal>

        {/* Remove Liquidity Modal */}
        <Modal
          isOpen={isRemoveLiquidityOpen}
          onClose={() => setIsRemoveLiquidityOpen(false)}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Remove Liquidity
          </h2>
          <form>
            <label className="block text-sm font-medium text-gray-600">
              Token Amount
            </label>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Enter amount"
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setIsRemoveLiquidityOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">Confirm</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default LiquidityPage;
