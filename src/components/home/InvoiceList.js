import React, { useEffect, useState } from "react";
import {
  inVoiceList,
  onErrorStopLoad,
  deleteInvoice,
} from "../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import swal from "sweetalert";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const [invoiceData, setInvoiceData] = useState([]);

  // get all invoice
  useEffect(() => {
    handleGetInvoice();
  }, []);

  // get all invoice
  const handleGetInvoice = () => {
    dispatch(
      inVoiceList({
        cb(res) {
          if (res.status === 200) {
            setInvoiceData(res?.data?.data);
          }
        },
      })
    );
  };

  const handleDeleteInvoice = (id) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this invoice?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let params = {
          id: id,
        };
        dispatch(
          deleteInvoice({
            ...params,
            cb(res) {
              if (res.status === 200) {
                handleGetInvoice();
              }
            },
          })
        );
        swal("Deleted!", "Your invoice  has been deleted!", "success");
      }
    });
  };

  return (
    <>
      <div className="bg-white invoiceListMain">
        <div>
          <h1 className="my-4 text-center">Invoice List</h1>
          <div className="mb-2 text-end">
            <Link to="/">Back Home</Link>
          </div>
          <table>
            <tr>
              <th>Id</th>
              <th>Invoice Name</th>
              <th>Country</th>
              <th>Bill To</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>

            {invoiceData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {item?.name ? <td>{item?.name}</td> : <td>--</td>}
                {item?.data?.country ? (
                  <td>{item?.data?.country}</td>
                ) : (
                  <td>--</td>
                )}

                {item?.data?.billTo ? (
                  <td>{item?.data?.billTo}</td>
                ) : (
                  <td>--</td>
                )}
                <td>
                  {moment(item?.created_at).format("DD-MM-YYYY hh:mm:ss")}
                </td>
                <td>
                  <Link to={`/?id=${item?.id}`}>
                    <i title="edit invoice" className="fa fa-pen me-3"></i>
                  </Link>
                  <i
                    onClick={() => handleDeleteInvoice(item?.id)}
                    title="delete invoice"
                    className="fa fa-trash"
                  ></i>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;
