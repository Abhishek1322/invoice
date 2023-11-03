import React, { useEffect, useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../../redux/slices/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  addInvoice,
  onErrorStopLoad,
  updateInvoice,
  singleInvoice,
} from "../../redux/slices/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = location;
  const searchParams = new URLSearchParams(search);
  const invoiceId = searchParams.get("id");
  const authToken = localStorage.getItem("invoiceAuthToken");
  const [invoiceStartDate, setInVoiceStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [subTotal, setSubTotal] = useState("");
  const [addTax, setAddTax] = useState("");
  const [taxPrice, setTaxPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [listItems, setListItems] = useState([
    {
      name: "Test Description",
      quantity: 0,
      rate: 0,
      tax: 0,
    },
  ]);
  const [formData, setFormData] = useState({
    yourCompany: "",
    yourName: "",
    companyAddress: "",
    cityZip: "",
    country: "",
    billTo: "Bill To:",
    clientCompany: "",
    clientAddress: "",
    clientCityZip: "",
    clientCountry: "",
    invoiceText: "Invoice#",
    invoiceNumber: "",
    invoiceDate: "Invoice Date",
    invoiceDueDate: "Due Date",
    itemDescription: "Item Description",
    itemQty: "Qty",
    itemRate: "Rate",
    itemTax: "Tax",
    itemAmount: "Amount",
    inVoice: "INVOICE",
  });

  // save invoice information
  const handleSubmitInvoice = () => {
    if (!authToken) {
      toast.warning("Please login first to save invoice information");
      navigate("/login");
      return;
    }

    let params = {
      name: formData.inVoice,
      id: invoiceId ? invoiceId : "",
      data: {
        yourCompany: formData.yourCompany,
        yourName: formData.yourName,
        companyAddress: formData.companyAddress,
        cityZip: formData.cityZip,
        country: formData.country,
        billTo: formData.billTo,
        clientCompany: formData.clientCompany,
        clientAddress: formData.clientAddress,
        clientCityZip: formData.clientCityZip,
        clientCountry: formData.clientCountry,
        invoiceText: formData.invoiceText,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        invoiceStartDate: invoiceStartDate,
        dueDate: dueDate,
        itemDescription: formData.itemDescription,
        itemQty: formData.itemQty,
        itemRate: formData.itemRate,
        itemTax: formData.itemTax,
        itemAmount: formData.itemAmount,
        invoiceData: listItems,
      },
    };
    if (invoiceId) {
      dispatch(
        updateInvoice({
          ...params,
          cb(res) {
            if (res.status === 200) {
              navigate("/invoice-list");
            }
          },
        })
      );
    } else {
      dispatch(
        addInvoice({
          ...params,
          cb(res) {},
        })
      );
    }
  };

  console.log("formDataformData", formData);

  // download generated html file
  const handleDownloadPDF = async () => {
    const content = contentRef.current;
    if (!content) {
      console.error("Content element not found.");
      return;
    }
    try {
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("downloaded-pdf.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // add new input item
  const addLineItem = () => {
    setListItems([...listItems, { name: "", quantity: 1, rate: 0, tax: 0 }]);
  };

  // remove input item
  const removeLineItem = (index) => {
    const updatedListItems = [...listItems];
    updatedListItems.splice(index, 1);
    setListItems(updatedListItems);
  };

  // change input
  const handleInputChange = (index, key, value) => {
    const updatedListItems = [...listItems];
    updatedListItems[index][key] = value;
    setListItems(updatedListItems);
  };

  // get total price
  useEffect(() => {
    // get subtotal price
    const getTotalPrice = listItems?.map((item, index) => {
      return item.quantity * item.rate;
    });
    const totalPrice = getTotalPrice.reduce(
      (previousScore, currentScore, index) => previousScore + currentScore,
      0
    );
    setSubTotal(totalPrice);

    // get total tax in percentage
    const getTax = listItems?.map((item, index) => {
      return Number(item.tax);
    });
    const totalTax = getTax.reduce(
      (previousScore, currentScore, index) => previousScore + currentScore,
      0
    );
    const calCulateTotalPrice = totalPrice + totalTax;
    setTotalPrice(calCulateTotalPrice);
    setTaxPrice(totalTax);
    const taxInPercentage = (totalTax / totalPrice) * 100;
    setAddTax(Math.round(taxInPercentage));
  }, [listItems]);

  // get image
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (
        rejectedFiles.length > 0 &&
        rejectedFiles[0]?.file?.type !== "image/jpeg" &&
        "image/jpg" &&
        "image/png" &&
        "image/svg"
      ) {
        toast.error("Please upload valid image");
        return;
      }

      let params = {
        photo: acceptedFiles[0],
      };

      dispatch(
        uploadImage({
          ...params,
          cb(res) {
            if (res.status === 200) {
              setImageUrl(res?.data?.data?.imageurl);
            }
          },
        })
      );
      setImage(acceptedFiles[0]);
    },
    [image]
  );

  // show errrors
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "image/svg": [],
    },
    multiple: false,
  });

  // remove image
  const handleRemoveImage = (img) => {
    if (img === imageUrl) {
      setImageUrl("");
    }
  };

  // Getting values of input field
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // stop loader on page load
  useEffect(() => {
    dispatch(onErrorStopLoad());
  }, [dispatch]);

  // get invoice data
  useEffect(() => {
    if (invoiceId) {
      let params = {
        id: invoiceId,
      };
      dispatch(
        singleInvoice({
          ...params,
          cb(res) {
            console.log("checkkkkkkkkkKar", res);
            if (res.status === 200) {
              setFormData({
                yourCompany: res?.data?.data?.data?.yourCompany,
                yourName: res?.data?.data?.data?.yourName,
                companyAddress: res?.data?.data?.data?.companyAddress,
                cityZip: res?.data?.data?.data?.cityZip,
                country: res?.data?.data?.data?.country,
                billTo: res?.data?.data?.data?.billTo,
                clientCompany: res?.data?.data?.data?.clientCompany,
                clientAddress: res?.data?.data?.data?.clientAddress,
                clientCityZip: res?.data?.data?.data?.clientCityZip,
                clientCountry: res?.data?.data?.data?.clientCountry,
                invoiceText: res?.data?.data?.data?.invoiceText,
                invoiceNumber: res?.data?.data?.data?.invoiceNumber,
                invoiceDate: res?.data?.data?.data?.invoiceDate,
                invoiceData: listItems,
                inVoice: res?.data?.data?.name,
              });
              setInVoiceStartDate(res?.data?.data?.data?.invoiceStartDate);
              setDueDate(res?.data?.data?.data?.dueDate);
              setListItems(res?.data?.data?.data?.invoiceData);
            }
          },
        })
      );
    }
  }, []);

  return (
    <>
      <div className="container-invoice">
        <div className="invoice-download">
          <div ref={contentRef} className="invoice-main">
            <div className="d-flex align-items-center">
              <div className="upload-logo-section">
                {imageUrl ? (
                  <>
                    <img alt="image" src={imageUrl} />
                    <div>
                      <i {...getRootProps()} className="fa fa-pen"></i>
                      <input {...getInputProps()} />
                      <i
                        onClick={() => handleRemoveImage(imageUrl)}
                        className="fa fa-trash"
                      ></i>
                    </div>
                  </>
                ) : (
                  <div {...getRootProps()} className="add-logo">
                    <span className="add-logo-label">
                      <svg
                        data-name="Layer 1"
                        viewBox="0 0 512 512"
                        alt="upload"
                        className="upload-svg"
                      >
                        <path
                          d="M340.7061,253.5177a21.0039,21.0039,0,0,1-29.7,0l-37.36-37.37v130.4a21,21,0,1,1-42,0v-130.4l-37.37,37.37a21.0011,21.0011,0,1,1-29.7-29.7l73.22-73.22a21.0035,21.0035,0,0,1,29.7,0l73.21,73.22A21.0041,21.0041,0,0,1,340.7061,253.5177Z"
                          style={{ fill: "#5b9aff" }}
                        ></path>
                        <path
                          d="M439.086,400.7277a20.9985,20.9985,0,1,1-33.43-25.42,192.0478,192.0478,0,0,0-17.24-251.77c-74.85-74.87-196.66-74.88-271.53-.03a192.0528,192.0528,0,0,0-17.29,251.76,20.9985,20.9985,0,1,1-33.43,25.42,234.019,234.019,0,0,1,186.47-375.4h.03a234.0221,234.0221,0,0,1,186.42,375.44Z"
                          style={{ fill: "#5b9aff" }}
                        ></path>
                        <path
                          d="M485.6461,470.0377a21.0039,21.0039,0,0,1-21,21h-424a21,21,0,0,1,0-42h424A21.004,21.004,0,0,1,485.6461,470.0377Z"
                          style={{ fill: "#5b9aff" }}
                        ></path>
                      </svg>
                      <div>Upload</div>
                    </span>
                  </div>
                )}

                <div className="upload-section-note">
                  Upload Logo
                  <div>
                    240 x 240 pixels @ 72 DPI,
                    <br />
                    Maximum size of 1MB.
                  </div>
                </div>
              </div>
              <div className="inv-header-container">
                <input
                  className="alltextInput form-control invoiceInput common-input"
                  type="text"
                  value={formData.inVoice}
                  onChange={(e) => handleChange(e)}
                  name="inVoice"
                />
              </div>
            </div>

            <div className="comp-addr-outer clearfix">
              <div className="comp-addr-inner">
                <input
                  type="text"
                  id="address1"
                  className="adr bld f20 form-control common-input"
                  style={{ height: 30 }}
                  tabIndex={1}
                  autofocus=""
                  onChange={(e) => handleChange(e)}
                  name="yourCompany"
                  placeholder="Your Company"
                  value={formData.yourCompany}
                />
                {/* <small id="address1_err" className="text-danger hide">
                  Please fill in your company’s name
                </small> */}
                <input
                  type="text"
                  id="custName"
                  className="adr form-control common-input"
                  tabIndex={2}
                  placeholder="Your Name"
                  onChange={(e) => handleChange(e)}
                  name="yourName"
                  value={formData.yourName}
                />
                <input
                  type="text"
                  id="address2"
                  className="adr form-control common-input"
                  tabIndex={3}
                  placeholder="Company’s Address"
                  onChange={(e) => handleChange(e)}
                  name="companyAddress"
                  value={formData.companyAddress}
                />
                <input
                  type="text"
                  className="adr form-control common-input"
                  id="address3"
                  tabIndex={4}
                  placeholder="City, State Zip"
                  onChange={(e) => handleChange(e)}
                  name="cityZip"
                  value={formData.cityZip}
                />
                <select
                  className="hide form-control common-input"
                  tabIndex={4}
                  name="country"
                  id="companyCountrySelect"
                  value={formData.country}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="us" selected="">
                    U.S.A
                  </option>
                  <option value="gb">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="in">India</option>
                  <option value="af">Afghanistan</option>
                  <option value="ax">Aland Islands</option>
                  <option value="al">Albania</option>
                  <option value="dz">Algeria</option>
                  <option value="as">American Samoa</option>
                  <option value="ad">Andorra</option>
                  <option value="ao">Angola</option>
                  <option value="ai">Anguilla</option>
                  <option value="aq">Antarctica</option>
                  <option value="ag">Antigua and Barbuda</option>
                  <option value="ar">Argentina</option>
                  <option value="am">Armenia</option>
                  <option value="aw">Aruba</option>
                  <option value="au">Australia</option>
                  <option value="at">Austria</option>
                  <option value="az">Azerbaijan</option>
                  <option value="bs">Bahamas</option>
                  <option value="bh">Bahrain</option>
                  <option value="bd">Bangladesh</option>
                  <option value="bb">Barbados</option>
                  <option value="by">Belarus</option>
                  <option value="be">Belgium</option>
                  <option value="bz">Belize</option>
                  <option value="bj">Benin</option>
                  <option value="bm">Bermuda</option>
                  <option value="bt">Bhutan</option>
                  <option value="bo">Bolivia</option>
                  <option value="ba">Bosnia</option>
                  <option value="bw">Botswana</option>
                  <option value="bv">Bouvet Island</option>
                  <option value="br">Brazil</option>
                  <option value="vg">British Virgin Islands</option>
                  <option value="bn">Brunei</option>
                  <option value="bg">Bulgaria</option>
                  <option value="bf">Burkina Faso</option>
                  <option value="bi">Burundi</option>
                  <option value="kh">Cambodia</option>
                  <option value="cm">Cameroon</option>
                  <option value="ca">Canada</option>
                  <option value="cv">Cape Verde</option>
                  <option value="ky">Cayman Islands</option>
                  <option value="cf">Central African Republic</option>
                  <option value="td">Chad</option>
                  <option value="cl">Chile</option>
                  <option value="cn">China</option>
                  <option value="cx">Christmas Island</option>
                  <option value="cc">Cocos Islands</option>
                  <option value="co">Colombia</option>
                  <option value="km">Comoros</option>
                  <option value="cg">Congo</option>
                  <option value="ck">Cook Islands</option>
                  <option value="cr">Costa Rica</option>
                  <option value="ci">Ivory Coast</option>
                  <option value="hr">Croatia</option>
                  <option value="cu">Cuba</option>
                  <option value="cy">Cyprus</option>
                  <option value="cz">Czech Republic</option>
                  <option value="dk">Denmark</option>
                  <option value="dj">Djibouti</option>
                  <option value="dm">Dominica</option>
                  <option value="do">Dominican Republic</option>
                  <option value="ec">Ecuador</option>
                  <option value="eg">Egypt</option>
                  <option value="sv">El Salvador</option>
                  <option value="gq">Equatorial Guinea</option>
                  <option value="er">Eritrea</option>
                  <option value="ee">Estonia</option>
                  <option value="et">Ethiopia</option>
                  <option value="fk">Falkland Islands</option>
                  <option value="fo">Faroe Islands</option>
                  <option value="fj">Fiji</option>
                  <option value="fi">Finland</option>
                  <option value="fr">France</option>
                  <option value="gf">French Guiana</option>
                  <option value="pf">French Polynesia</option>
                  <option value="tf">French Southern Territories</option>
                  <option value="ga">Gabon</option>
                  <option value="gm">Gambia</option>
                  <option value="ge">Georgia</option>
                  <option value="de">Germany</option>
                  <option value="gh">Ghana</option>
                  <option value="gi">Gibraltar</option>
                  <option value="gr">Greece</option>
                  <option value="gl">Greenland</option>
                  <option value="gd">Grenada</option>
                  <option value="gp">Guadeloupe</option>
                  <option value="gu">Guam</option>
                  <option value="gt">Guatemala</option>
                  <option value="gg">Guernsey</option>
                  <option value="gw">Guinea-Bissau</option>
                  <option value="gn">Guinea</option>
                  <option value="gy">Guyana</option>
                  <option value="ht">Haiti</option>
                  <option value="hm">Heard Island and McDonald Islands</option>
                  <option value="hn">Honduras</option>
                  <option value="hk">Hong Kong</option>
                  <option value="hu">Hungary</option>
                  <option value="is">Iceland</option>
                  <option value="in">India</option>
                  <option value="id">Indonesia</option>
                  <option value="ir">Iran</option>
                  <option value="iq">Iraq</option>
                  <option value="ie">Ireland</option>
                  <option value="im">Isle of Man</option>
                  <option value="il">Israel</option>
                  <option value="it">Italy</option>
                  <option value="jm">Jamaica</option>
                  <option value="jp">Japan</option>
                  <option value="je">Jersey</option>
                  <option value="jo">Jordan</option>
                  <option value="kz">Kazakhstan</option>
                  <option value="ke">Kenya</option>
                  <option value="ki">Kiribati</option>
                  <option value="xk">Kosova Republic</option>
                  <option value="kw">Kuwait</option>
                  <option value="kg">Kyrgyzstan</option>
                  <option value="la">Laos</option>
                  <option value="lv">Latvia</option>
                  <option value="lb">Lebanon</option>
                  <option value="ls">Lesotho</option>
                  <option value="lr">Liberia</option>
                  <option value="ly">Libya</option>
                  <option value="li">Liechtenstein</option>
                  <option value="lt">Lithuania</option>
                  <option value="lu">Luxembourg</option>
                  <option value="mo">Macau</option>
                  <option value="mk">Macedonia</option>
                  <option value="mg">Madagascar</option>
                  <option value="mw">Malawi</option>
                  <option value="my">Malaysia</option>
                  <option value="mv">Maldives</option>
                  <option value="ml">Mali</option>
                  <option value="mt">Malta</option>
                  <option value="mh">Marshall Islands</option>
                  <option value="mq">Martinique</option>
                  <option value="mr">Mauritania</option>
                  <option value="mu">Mauritius</option>
                  <option value="yt">Mayotte</option>
                  <option value="mx">Mexico</option>
                  <option value="fm">Micronesia</option>
                  <option value="md">Moldova</option>
                  <option value="mc">Monaco</option>
                  <option value="mn">Mongolia</option>
                  <option value="me">Montenegro</option>
                  <option value="ms">Montserrat</option>
                  <option value="ma">Morocco</option>
                  <option value="mz">Mozambique</option>
                  <option value="mm">Myanmar</option>
                  <option value="na">Namibia</option>
                  <option value="nr">Nauru</option>
                  <option value="np">Nepal</option>
                  <option value="nl">Netherlands</option>
                  <option value="an">Netherlands Antilles</option>
                  <option value="nc">New Caledonia</option>
                  <option value="nz">New Zealand</option>
                  <option value="ni">Nicaragua</option>
                  <option value="ne">Niger</option>
                  <option value="ng">Nigeria</option>
                  <option value="nu">Niue</option>
                  <option value="nf">Norfolk Island</option>
                  <option value="mp">Northern Mariana Islands</option>
                  <option value="kp">North Korea</option>
                  <option value="no">Norway</option>
                  <option value="om">Oman</option>
                  <option value="pk">Pakistan</option>
                  <option value="pw">Palau</option>
                  <option value="ps">Palestine</option>
                  <option value="pa">Panama</option>
                  <option value="pg">Papua New Guinea</option>
                  <option value="py">Paraguay</option>
                  <option value="pe">Peru</option>
                  <option value="ph">Philippines</option>
                  <option value="pn">Pitcairn</option>
                  <option value="pl">Poland</option>
                  <option value="pt">Portugal</option>
                  <option value="pr">Puerto Rico</option>
                  <option value="qa">Qatar</option>
                  <option value="ro">Romania</option>
                  <option value="ru">Russia</option>
                  <option value="rw">Rwanda</option>
                  <option value="kn">Saint Kitts and Nevis</option>
                  <option value="lc">Saint Lucia</option>
                  <option value="pm">Saint Pierre and Miquelon</option>
                  <option value="vc">Saint Vincent and the Grenadines</option>
                  <option value="ws">Samoa</option>
                  <option value="sm">SanMarino</option>
                  <option value="sa">Saudi Arabia</option>
                  <option value="sn">Senegal</option>
                  <option value="rs">Serbia</option>
                  <option value="sc">Seychelles</option>
                  <option value="sl">Sierra Leone</option>
                  <option value="sg">Singapore</option>
                  <option value="sk">Slovakia</option>
                  <option value="si">Slovenia</option>
                  <option value="sb">Solomon Islands</option>
                  <option value="so">Somalia</option>
                  <option value="za">South Africa</option>
                  <option value="gs">
                    South Georgia and the South Sandwich Islands
                  </option>
                  <option value="kr">South Korea</option>
                  <option value="es">Spain</option>
                  <option value="lk">Sri Lanka</option>
                  <option value="sd">Sudan</option>
                  <option value="sr">Suriname</option>
                  <option value="sj">Svalbard and Jan Mayen</option>
                  <option value="sz">Swaziland</option>
                  <option value="se">Sweden</option>
                  <option value="ch">Switzerland</option>
                  <option value="sy">Syria</option>
                  <option value="tw">Taiwan</option>
                  <option value="tj">Tajikistan</option>
                  <option value="tz">Tanzania</option>
                  <option value="th">Thailand</option>
                  <option value="tg">Togo</option>
                  <option value="tk">Tokelau</option>
                  <option value="to">Tonga</option>
                  <option value="tt">Trinidad and Tobago</option>
                  <option value="tn">Tunisia</option>
                  <option value="tr">Turkey</option>
                  <option value="tm">Turkmenistan</option>
                  <option value="tv">Tuvalu</option>
                  <option value="ug">Uganda</option>
                  <option value="ua">Ukraine</option>
                  <option value="ae">United Arab Emirates</option>
                  <option value="gb">United Kingdom</option>
                  <option value="uy">Uruguay</option>
                  <option value="us">U.S.A</option>
                  <option value="uz">Uzbekistan</option>
                  <option value="vu">Vanuatu</option>
                  <option value="va">Vatican City</option>
                  <option value="ve">Venezuela</option>
                  <option value="vn">Vietnam</option>
                  <option value="vg">Virgin Islands, British</option>
                  <option value="vi">Virgin Islands, U.S.</option>
                  <option value="wf">Wallis and Futuna</option>
                  <option value="eh">Western Sahara</option>
                  <option value="ye">Yemen</option>
                  <option value="zm">Zambia</option>
                  <option value="zw">Zimbabwe</option>
                </select>
                <br />
              </div>
            </div>

            <ul className="pull-left bill-addr">
              <li className="adr-lft pull-left">
                <input
                  type="text"
                  value={formData?.billTo}
                  id="billToLabel"
                  className="adr bill-to bld form-control common-input"
                  tabIndex={6}
                  onChange={(e) => handleChange(e)}
                  name="billTo"
                />
                <input
                  type="text"
                  id="billingAddress1"
                  className="adr form-control common-input"
                  tabIndex={6}
                  placeholder="Your Client’s Company"
                  onChange={(e) => handleChange(e)}
                  name="clientCompany"
                  value={formData.clientCompany}
                />

                <input
                  type="text"
                  id="billingAddress2"
                  className="adr form-control common-input"
                  tabIndex={7}
                  placeholder="Client’s Address"
                  onChange={(e) => handleChange(e)}
                  name="clientAddress"
                  value={formData.clientAddress}
                />
                <input
                  type="text"
                  className="adr form-control common-input"
                  id="billingAddress3"
                  tabIndex={8}
                  placeholder="City, State Zip"
                  onChange={(e) => handleChange(e)}
                  name="clientCityZip"
                  value={formData.clientCityZip}
                />
                <select
                  value={formData.clientCountry}
                  className="hide w-auto form-control common-input"
                  tabIndex={10}
                  onChange={(e) => handleChange(e)}
                  name="clientCountry"
                >
                  <option value="us" selected="">
                    U.S.A
                  </option>
                  <option value="gb">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="in">India</option>
                  <option value="af">Afghanistan</option>
                  <option value="ax">Aland Islands</option>
                  <option value="al">Albania</option>
                  <option value="dz">Algeria</option>
                  <option value="as">American Samoa</option>
                  <option value="ad">Andorra</option>
                  <option value="ao">Angola</option>
                  <option value="ai">Anguilla</option>
                  <option value="aq">Antarctica</option>
                  <option value="ag">Antigua and Barbuda</option>
                  <option value="ar">Argentina</option>
                  <option value="am">Armenia</option>
                  <option value="aw">Aruba</option>
                  <option value="au">Australia</option>
                  <option value="at">Austria</option>
                  <option value="az">Azerbaijan</option>
                  <option value="bs">Bahamas</option>
                  <option value="bh">Bahrain</option>
                  <option value="bd">Bangladesh</option>
                  <option value="bb">Barbados</option>
                  <option value="by">Belarus</option>
                  <option value="be">Belgium</option>
                  <option value="bz">Belize</option>
                  <option value="bj">Benin</option>
                  <option value="bm">Bermuda</option>
                  <option value="bt">Bhutan</option>
                  <option value="bo">Bolivia</option>
                  <option value="ba">Bosnia</option>
                  <option value="bw">Botswana</option>
                  <option value="bv">Bouvet Island</option>
                  <option value="br">Brazil</option>
                  <option value="vg">British Virgin Islands</option>
                  <option value="bn">Brunei</option>
                  <option value="bg">Bulgaria</option>
                  <option value="bf">Burkina Faso</option>
                  <option value="bi">Burundi</option>
                  <option value="kh">Cambodia</option>
                  <option value="cm">Cameroon</option>
                  <option value="ca">Canada</option>
                  <option value="cv">Cape Verde</option>
                  <option value="ky">Cayman Islands</option>
                  <option value="cf">Central African Republic</option>
                  <option value="td">Chad</option>
                  <option value="cl">Chile</option>
                  <option value="cn">China</option>
                  <option value="cx">Christmas Island</option>
                  <option value="cc">Cocos Islands</option>
                  <option value="co">Colombia</option>
                  <option value="km">Comoros</option>
                  <option value="cg">Congo</option>
                  <option value="ck">Cook Islands</option>
                  <option value="cr">Costa Rica</option>
                  <option value="ci">Ivory Coast</option>
                  <option value="hr">Croatia</option>
                  <option value="cu">Cuba</option>
                  <option value="cy">Cyprus</option>
                  <option value="cz">Czech Republic</option>
                  <option value="dk">Denmark</option>
                  <option value="dj">Djibouti</option>
                  <option value="dm">Dominica</option>
                  <option value="do">Dominican Republic</option>
                  <option value="ec">Ecuador</option>
                  <option value="eg">Egypt</option>
                  <option value="sv">El Salvador</option>
                  <option value="gq">Equatorial Guinea</option>
                  <option value="er">Eritrea</option>
                  <option value="ee">Estonia</option>
                  <option value="et">Ethiopia</option>
                  <option value="fk">Falkland Islands</option>
                  <option value="fo">Faroe Islands</option>
                  <option value="fj">Fiji</option>
                  <option value="fi">Finland</option>
                  <option value="fr">France</option>
                  <option value="gf">French Guiana</option>
                  <option value="pf">French Polynesia</option>
                  <option value="tf">French Southern Territories</option>
                  <option value="ga">Gabon</option>
                  <option value="gm">Gambia</option>
                  <option value="ge">Georgia</option>
                  <option value="de">Germany</option>
                  <option value="gh">Ghana</option>
                  <option value="gi">Gibraltar</option>
                  <option value="gr">Greece</option>
                  <option value="gl">Greenland</option>
                  <option value="gd">Grenada</option>
                  <option value="gp">Guadeloupe</option>
                  <option value="gu">Guam</option>
                  <option value="gt">Guatemala</option>
                  <option value="gg">Guernsey</option>
                  <option value="gw">Guinea-Bissau</option>
                  <option value="gn">Guinea</option>
                  <option value="gy">Guyana</option>
                  <option value="ht">Haiti</option>
                  <option value="hm">Heard Island and McDonald Islands</option>
                  <option value="hn">Honduras</option>
                  <option value="hk">Hong Kong</option>
                  <option value="hu">Hungary</option>
                  <option value="is">Iceland</option>
                  <option value="in">India</option>
                  <option value="id">Indonesia</option>
                  <option value="ir">Iran</option>
                  <option value="iq">Iraq</option>
                  <option value="ie">Ireland</option>
                  <option value="im">Isle of Man</option>
                  <option value="il">Israel</option>
                  <option value="it">Italy</option>
                  <option value="jm">Jamaica</option>
                  <option value="jp">Japan</option>
                  <option value="je">Jersey</option>
                  <option value="jo">Jordan</option>
                  <option value="kz">Kazakhstan</option>
                  <option value="ke">Kenya</option>
                  <option value="ki">Kiribati</option>
                  <option value="xk">Kosova Republic</option>
                  <option value="kw">Kuwait</option>
                  <option value="kg">Kyrgyzstan</option>
                  <option value="la">Laos</option>
                  <option value="lv">Latvia</option>
                  <option value="lb">Lebanon</option>
                  <option value="ls">Lesotho</option>
                  <option value="lr">Liberia</option>
                  <option value="ly">Libya</option>
                  <option value="li">Liechtenstein</option>
                  <option value="lt">Lithuania</option>
                  <option value="lu">Luxembourg</option>
                  <option value="mo">Macau</option>
                  <option value="mk">Macedonia</option>
                  <option value="mg">Madagascar</option>
                  <option value="mw">Malawi</option>
                  <option value="my">Malaysia</option>
                  <option value="mv">Maldives</option>
                  <option value="ml">Mali</option>
                  <option value="mt">Malta</option>
                  <option value="mh">Marshall Islands</option>
                  <option value="mq">Martinique</option>
                  <option value="mr">Mauritania</option>
                  <option value="mu">Mauritius</option>
                  <option value="yt">Mayotte</option>
                  <option value="mx">Mexico</option>
                  <option value="fm">Micronesia</option>
                  <option value="md">Moldova</option>
                  <option value="mc">Monaco</option>
                  <option value="mn">Mongolia</option>
                  <option value="me">Montenegro</option>
                  <option value="ms">Montserrat</option>
                  <option value="ma">Morocco</option>
                  <option value="mz">Mozambique</option>
                  <option value="mm">Myanmar</option>
                  <option value="na">Namibia</option>
                  <option value="nr">Nauru</option>
                  <option value="np">Nepal</option>
                  <option value="nl">Netherlands</option>
                  <option value="an">Netherlands Antilles</option>
                  <option value="nc">New Caledonia</option>
                  <option value="nz">New Zealand</option>
                  <option value="ni">Nicaragua</option>
                  <option value="ne">Niger</option>
                  <option value="ng">Nigeria</option>
                  <option value="nu">Niue</option>
                  <option value="nf">Norfolk Island</option>
                  <option value="mp">Northern Mariana Islands</option>
                  <option value="kp">North Korea</option>
                  <option value="no">Norway</option>
                  <option value="om">Oman</option>
                  <option value="pk">Pakistan</option>
                  <option value="pw">Palau</option>
                  <option value="ps">Palestine</option>
                  <option value="pa">Panama</option>
                  <option value="pg">Papua New Guinea</option>
                  <option value="py">Paraguay</option>
                  <option value="pe">Peru</option>
                  <option value="ph">Philippines</option>
                  <option value="pn">Pitcairn</option>
                  <option value="pl">Poland</option>
                  <option value="pt">Portugal</option>
                  <option value="pr">Puerto Rico</option>
                  <option value="qa">Qatar</option>
                  <option value="ro">Romania</option>
                  <option value="ru">Russia</option>
                  <option value="rw">Rwanda</option>
                  <option value="kn">Saint Kitts and Nevis</option>
                  <option value="lc">Saint Lucia</option>
                  <option value="pm">Saint Pierre and Miquelon</option>
                  <option value="vc">Saint Vincent and the Grenadines</option>
                  <option value="ws">Samoa</option>
                  <option value="sm">SanMarino</option>
                  <option value="sa">Saudi Arabia</option>
                  <option value="sn">Senegal</option>
                  <option value="rs">Serbia</option>
                  <option value="sc">Seychelles</option>
                  <option value="sl">Sierra Leone</option>
                  <option value="sg">Singapore</option>
                  <option value="sk">Slovakia</option>
                  <option value="si">Slovenia</option>
                  <option value="sb">Solomon Islands</option>
                  <option value="so">Somalia</option>
                  <option value="za">South Africa</option>
                  <option value="gs">
                    South Georgia and the South Sandwich Islands
                  </option>
                  <option value="kr">South Korea</option>
                  <option value="es">Spain</option>
                  <option value="lk">Sri Lanka</option>
                  <option value="sd">Sudan</option>
                  <option value="sr">Suriname</option>
                  <option value="sj">Svalbard and Jan Mayen</option>
                  <option value="sz">Swaziland</option>
                  <option value="se">Sweden</option>
                  <option value="ch">Switzerland</option>
                  <option value="sy">Syria</option>
                  <option value="tw">Taiwan</option>
                  <option value="tj">Tajikistan</option>
                  <option value="tz">Tanzania</option>
                  <option value="th">Thailand</option>
                  <option value="tg">Togo</option>
                  <option value="tk">Tokelau</option>
                  <option value="to">Tonga</option>
                  <option value="tt">Trinidad and Tobago</option>
                  <option value="tn">Tunisia</option>
                  <option value="tr">Turkey</option>
                  <option value="tm">Turkmenistan</option>
                  <option value="tv">Tuvalu</option>
                  <option value="ug">Uganda</option>
                  <option value="ua">Ukraine</option>
                  <option value="ae">United Arab Emirates</option>
                  <option value="gb">United Kingdom</option>
                  <option value="uy">Uruguay</option>
                  <option value="us">U.S.A</option>
                  <option value="uz">Uzbekistan</option>
                  <option value="vu">Vanuatu</option>
                  <option value="va">Vatican City</option>
                  <option value="ve">Venezuela</option>
                  <option value="vn">Vietnam</option>
                  <option value="vg">Virgin Islands, British</option>
                  <option value="vi">Virgin Islands, U.S.</option>
                  <option value="wf">Wallis and Futuna</option>
                  <option value="eh">Western Sahara</option>
                  <option value="ye">Yemen</option>
                  <option value="zm">Zambia</option>
                  <option value="zw">Zimbabwe</option>
                </select>
              </li>
              <li className="adr-rgt pull-left">
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  className="bill"
                  style={{ tableLayout: "fixed" }}
                >
                  <tbody>
                    <tr>
                      <td className="lft-txt" width="40%">
                        <input
                          type="text"
                          value={formData.invoiceText}
                          id="invNumberLabel"
                          className="bld text-left w100 form-control common-input"
                          tabIndex={12}
                          onChange={(e) => handleChange(e)}
                          name="invoiceText"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="w100 form-control common-input"
                          id="invNumber"
                          value={formData.invoiceNumber}
                          tabIndex={13}
                          placeholder="INV-12"
                          onChange={(e) => handleChange(e)}
                          name="invoiceNumber"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="lft-txt">
                        <input
                          type="text"
                          value={formData.invoiceDate}
                          id="invoiceDateLabel"
                          className="bld text-left w100 form-control common-input"
                          tabIndex={14}
                          onChange={(e) => handleChange(e)}
                          name="invoiceDate"
                        />
                      </td>
                      <td className="">
                        <DatePicker
                          className="w100 form-control date-field common-input"
                          value={moment(invoiceStartDate).format("DD/MM/YYYY")}
                          onChange={(date) => setInVoiceStartDate(date)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="lft-txt">
                        <input
                          value={formData.invoiceDueDate}
                          id="dueDateLabel"
                          className="bld text-left w100 form-control common-input"
                          type="text"
                          tabIndex={16}
                          onChange={(e) => handleChange(e)}
                          name="invoiceDueDate"
                        />
                      </td>
                      <td>
                        <DatePicker
                          className="bld text-left w100 form-control common-input"
                          value={moment(dueDate).format("DD/MM/YYYY")}
                          onChange={(date) => setDueDate(date)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>

            <div className="lineItemDIV">
              <div className="table-header">
                <input
                  type="text"
                  className="common-input form-control des-input"
                  value={formData.itemDescription}
                  onChange={(e) => handleChange(e)}
                  name="itemDescription"
                />
                <input
                  type="text"
                  className="common-input form-control qty-input"
                  value={formData.itemQty}
                  onChange={(e) => handleChange(e)}
                  name="itemQty"
                />
                <input
                  type="text"
                  className="common-input form-control qty-input"
                  value={formData.itemRate}
                  onChange={(e) => handleChange(e)}
                  name="itemRate"
                />
                <input
                  type="text"
                  className="common-input form-control qty-input"
                  value={formData.itemTax}
                  onChange={(e) => handleChange(e)}
                  name="itemTax"
                />
                <input
                  type="text"
                  className="common-input form-control qty-input"
                  value={formData.itemAmount}
                  onChange={(e) => handleChange(e)}
                  name="itemAmount"
                />
              </div>
            </div>

            {listItems?.map((item, index) => (
              <div key={index} className="listItems">
                <textarea
                  className="common-input des-name form-control"
                  value={item.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="common-input qty-value form-control"
                  value={item.quantity}
                  onChange={(e) =>
                    handleInputChange(index, "quantity", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="common-input rate-value form-control"
                  value={item.rate}
                  onChange={(e) =>
                    handleInputChange(index, "rate", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="common-input tax-value form-control"
                  value={item.tax}
                  onChange={(e) =>
                    handleInputChange(index, "tax", e.target.value)
                  }
                />
                <p className="qtyPrice">{item.quantity * item.rate}</p>
                <i
                  onClick={() => removeLineItem(index)}
                  className="fa fa-times crossIcon"
                ></i>
              </div>
            ))}

            <div className="totalPrice">
              <div className="addLineDiv">
                <button onClick={addLineItem}>Add line Item</button>
              </div>

              <div className="totalTaxPrice">
                <div className="subTotal">
                  <input
                    value={"Sub Total"}
                    className="form-control common-input"
                  />
                  <p className="subtotalPrice">{subTotal}.00</p>
                </div>
                <div className="taxTotal">
                  <p>Tax({addTax ? addTax : 0}%)</p>
                  <p className="subtotalTaxPrice">{taxPrice}.00</p>
                </div>
                <div className="finalTotal">
                  <input
                    value={"Total"}
                    className="form-control common-input"
                  />
                  <div>
                    <p className="totalPrice">{totalPrice}.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoiceId ? (
            <div className="downoad-main">
              <h3>Update Invoice</h3>
              <div className="d-flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  type="button"
                  className="btn btn-primary"
                >
                  Download
                </button>
                <button
                  onClick={handleSubmitInvoice}
                  type="button"
                  className="btn btn-primary"
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div className="downoad-main">
              <h3>Download Invoice</h3>
              <div className="d-flex gap-2">
                <button
                  onClick={handleSubmitInvoice}
                  type="button"
                  className="btn btn-primary"
                >
                  Save Online
                </button>
                <button
                  onClick={handleDownloadPDF}
                  type="button"
                  className="btn btn-primary"
                >
                  Download
                </button>
                {authToken && <Link to="/invoice-list">Invoice List</Link>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
