import React, {useState} from "react";
import axiosInstance from "../../../utils/axiosInstance.js";
import HotToast from "react-hot-toast";
import Button from "../../../components/Button.jsx";

const AddUserModal = ({
                        isOpen, onClose, onAddUser
                      }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState(
    {username: "", phone: "", email: "", role: ""}
  )
  const roles = ["user", "admin"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/api/users/create-user", form)
      HotToast("Пользователь успешно добавлен")
      setSuccess("Пользователь успешно добавлен");
      setForm({username: "", phone: "", email: "", role: ""});
      setTimeout(() => {
        onClose();
        onAddUser();
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Ошибка при добавлении пользователя"
      );
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-dark-12 z-20 rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-gray-95 font-bold mb-4">
          Добавить нового пользователя
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="John Doe"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+1234567890"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="" hidden disabled>Выберите роль</option>
              {roles.map((role) => (
                <option key={role} value={role} className="capitalize">{role}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-40">
            <Button
              text="Отмена"
              className="!bg-dark-20 gap-2 hover:!bg-dark-30"
              onClick={onClose}
              type="button"
              disabled={loading}
            />
            <Button
              text={loading ? "Создание..." : "Создать пользователя"}
              className="!bg-brown-60 gap-2 hover:!bg-brown-70"
              type="submit"
              disabled={loading}
            />
          </div>



        </form>


      </div>

      <div
        className="absolute inset-0 z-10 backdrop-blur-sm bg-dark-06/70"
        onClick={onClose}
      ></div>

    </div>
  );
};

export default AddUserModal;