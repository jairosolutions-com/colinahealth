export default function MedicalHistoryTab() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <div className="flex justify-between">
        search bar
        <div className="flex">
          <button className="btn-add btn-add:hover mr-2 ">
            <img
              src="/imgs/addbtn.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2"
            />
            Button
          </button>
          <button className="btn-pdf btn-pdf:hover ">
            <img
              src="/imgs/addbtn.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2"
            />
            Button
          </button>
        </div>
      </div>
      <div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Severity
              </th>
              <th scope="col" className="px-6 py-3">
                Reaction
              </th>
              <th scope="col" className="px-6 py-3">
                Notes
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                03/11/2024
              </th>
              <td className="px-6 py-4">Skin Allergy</td>
              <td className="px-6 py-4">Major</td>
              <td className="px-6 py-4">Itchy</td>
              <td className="px-6 py-4">Irrirtated</td>
              <td className="px-6 py-4">
                <button
                  className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
               hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">Skin Allergy</td>
              <td className="px-6 py-4">Major</td>
              <td className="px-6 py-4">Itchy</td>
              <td className="px-6 py-4">Irrirtated</td>
              <td className="px-6 py-4">
                <button
                  className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
               hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Magic Mouse 2
              </th>
              <td className="px-6 py-4">Skin Allergy</td>
              <td className="px-6 py-4">Major</td>
              <td className="px-6 py-4">Itchy</td>
              <td className="px-6 py-4">Irrirtated</td>
              <td className="px-6 py-4">
                <button
                  className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
               hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Google Pixel Phone
              </th>
              <td className="px-6 py-4">Skin Allergy</td>
              <td className="px-6 py-4">Major</td>
              <td className="px-6 py-4">Itchy</td>
              <td className="px-6 py-4">Irrirtated</td>
              <td className="px-6 py-4">
                <button
                  className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
               hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
              >
                Apple Watch 5
              </th>
              <td className="px-6 py-4">Skin Allergy</td>
              <td className="px-6 py-4">Major</td>
              <td className="px-6 py-4">Itchy</td>
              <td className="px-6 py-4">Irrirtated</td>
              <td className="px-6 py-4">
                <button
                  className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
               hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <div className="flex justify-between">
            Page 1 of 10
            <div>
              <nav aria-label="Page navigation example">
                <div className="inline-flex -space-x-px text-sm">
                  <div>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      Previous
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      1
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      2
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      aria-current="page"
                      className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >
                      3
                    </a>
                  </div>

                  <div>
                    <a
                      href="#"
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      Next
                    </a>
                  </div>
                  <div className="flex ">
                    <input type="text" />

                    <button>edit </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
